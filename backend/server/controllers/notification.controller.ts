import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { NotificationService } from '../services/NotificationService.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';

export class NotificationController {
  private static async resolveUserId(req: AuthRequest): Promise<string> {
    const rawIdOrAddr =
      req.userId ||
      req.userAddress ||
      (req.headers['x-wallet-address'] as string) ||
      (req.query.address as string);

    if (!rawIdOrAddr) {
      throw AppError.unauthorized('Authentication required to access notifications');
    }

    const user = await UserRepository.findUser(rawIdOrAddr);
    if (!user) {
      throw AppError.notFound('User record not found');
    }

    return user.id;
  }

  /**
   * GET /api/notifications
   */
  static async getNotifications(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = await NotificationController.resolveUserId(req);
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const unreadOnly = req.query.unreadOnly === 'true';

      const result = await NotificationService.getNotifications(userId, {
        page,
        limit,
        unreadOnly,
      });

      return sendSuccess(res, result, 'Notifications retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/notifications/unread-count
   */
  static async getUnreadCount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = await NotificationController.resolveUserId(req);
      const result = await NotificationService.getUnreadCount(userId);
      return sendSuccess(res, result, 'Unread notification count retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/notifications/:id/read
   */
  static async markAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = await NotificationController.resolveUserId(req);
      const { id } = req.params;

      if (!id) {
        throw AppError.badRequest('Notification ID is required');
      }

      const result = await NotificationService.markAsRead(userId, id);
      return sendSuccess(res, result, 'Notification marked as read');
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/notifications/read-all
   */
  static async markAllAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = await NotificationController.resolveUserId(req);
      const result = await NotificationService.markAllAsRead(userId);
      return sendSuccess(res, result, 'All notifications marked as read');
    } catch (err) {
      next(err);
    }
  }
}

export default NotificationController;
