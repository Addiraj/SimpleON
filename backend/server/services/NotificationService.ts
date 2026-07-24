import { NotificationType } from '@prisma/client';
import { prisma, isDatabaseAvailable } from '../config/database.js';
import { logger } from '../config/logger.js';
import { AppError } from '../utils/AppError.js';

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
}

interface MemoryNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  is_read: boolean;
  read_at?: Date | null;
  created_at: Date;
}

const memoryNotifications: MemoryNotification[] = [];

export class NotificationService {
  /**
   * Create a new in-app notification if the user has in-app notifications enabled in user_preferences.
   */
  static async createNotification(input: CreateNotificationInput) {
    try {
      if (!(await isDatabaseAvailable())) {
        const notif: MemoryNotification = {
          id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          user_id: input.userId,
          type: input.type,
          title: input.title,
          message: input.message,
          data: input.data,
          is_read: false,
          created_at: new Date(),
        };
        memoryNotifications.push(notif);
        return notif;
      }

      // 1. Check user preference for in_app_notifications
      const preference = await prisma.userPreference.findUnique({
        where: { user_id: input.userId },
      });

      if (preference && preference.in_app_notifications === false) {
        logger.info(
          { userId: input.userId, type: input.type },
          '[NotificationService] In-app notifications disabled for user, skipping notification creation'
        );
        return null;
      }

      // 2. Create Notification record
      const notification = await prisma.notification.create({
        data: {
          user_id: input.userId,
          type: input.type,
          title: input.title,
          message: input.message,
          data: input.data ? JSON.parse(JSON.stringify(input.data)) : undefined,
          is_read: false,
        },
      });

      logger.info(
        { notificationId: notification.id, userId: input.userId, type: input.type },
        '[NotificationService] Notification created successfully'
      );

      return notification;
    } catch (err: any) {
      logger.error(
        { error: err.message, userId: input.userId, type: input.type },
        '[NotificationService] Failed to create notification'
      );
      return null;
    }
  }

  /**
   * Get paginated list of notifications for a user, sorted newest first.
   */
  static async getNotifications(
    userId: string,
    options: { page?: number; limit?: number; unreadOnly?: boolean } = {}
  ) {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(options.limit) || 20));
    const skip = (page - 1) * limit;

    if (!(await isDatabaseAvailable())) {
      let userNotifs = memoryNotifications.filter((n) => n.user_id === userId);
      if (options.unreadOnly) {
        userNotifs = userNotifs.filter((n) => !n.is_read);
      }
      userNotifs.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
      const totalCount = userNotifs.length;
      const unreadCount = memoryNotifications.filter((n) => n.user_id === userId && !n.is_read).length;
      const items = userNotifs.slice(skip, skip + limit);
      const totalPages = Math.ceil(totalCount / limit) || 1;

      return {
        notifications: items.map((n) => ({
          id: n.id,
          userId: n.user_id,
          type: n.type,
          title: n.title,
          message: n.message,
          data: n.data,
          isRead: n.is_read,
          readAt: n.read_at,
          createdAt: n.created_at,
        })),
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages,
          hasMore: page < totalPages,
        },
        unreadCount,
      };
    }

    const whereClause: any = { user_id: userId };
    if (options.unreadOnly) {
      whereClause.is_read = false;
    }

    const [items, totalCount, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: whereClause,
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where: whereClause }),
      prisma.notification.count({
        where: { user_id: userId, is_read: false },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit) || 1;

    return {
      notifications: items.map((n) => ({
        id: n.id,
        userId: n.user_id,
        type: n.type,
        title: n.title,
        message: n.message,
        data: n.data,
        isRead: n.is_read,
        readAt: n.read_at,
        createdAt: n.created_at,
      })),
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasMore: page < totalPages,
      },
      unreadCount,
    };
  }

  /**
   * Get total unread count for a user.
   */
  static async getUnreadCount(userId: string) {
    if (!(await isDatabaseAvailable())) {
      const count = memoryNotifications.filter((n) => n.user_id === userId && !n.is_read).length;
      return { unreadCount: count };
    }
    const count = await prisma.notification.count({
      where: { user_id: userId, is_read: false },
    });
    return { unreadCount: count };
  }

  /**
   * Mark a single notification as read.
   */
  static async markAsRead(userId: string, notificationId: string) {
    if (!(await isDatabaseAvailable())) {
      const existing = memoryNotifications.find((n) => n.id === notificationId && n.user_id === userId);
      if (!existing) {
        throw AppError.notFound('Notification not found');
      }
      existing.is_read = true;
      existing.read_at = new Date();
      const unreadCount = memoryNotifications.filter((n) => n.user_id === userId && !n.is_read).length;
      return {
        notification: {
          id: existing.id,
          userId: existing.user_id,
          type: existing.type,
          title: existing.title,
          message: existing.message,
          data: existing.data,
          isRead: existing.is_read,
          readAt: existing.read_at,
          createdAt: existing.created_at,
        },
        unreadCount,
      };
    }

    const existing = await prisma.notification.findFirst({
      where: { id: notificationId, user_id: userId },
    });

    if (!existing) {
      throw AppError.notFound('Notification not found');
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        is_read: true,
        read_at: new Date(),
      },
    });

    const unreadCount = await prisma.notification.count({
      where: { user_id: userId, is_read: false },
    });

    return {
      notification: {
        id: updated.id,
        userId: updated.user_id,
        type: updated.type,
        title: updated.title,
        message: updated.message,
        data: updated.data,
        isRead: updated.is_read,
        readAt: updated.read_at,
        createdAt: updated.created_at,
      },
      unreadCount,
    };
  }

  /**
   * Mark all notifications for a user as read.
   */
  static async markAllAsRead(userId: string) {
    if (!(await isDatabaseAvailable())) {
      memoryNotifications.forEach((n) => {
        if (n.user_id === userId && !n.is_read) {
          n.is_read = true;
          n.read_at = new Date();
        }
      });
      return { success: true, unreadCount: 0 };
    }

    await prisma.notification.updateMany({
      where: { user_id: userId, is_read: false },
      data: {
        is_read: true,
        read_at: new Date(),
      },
    });

    return { success: true, unreadCount: 0 };
  }
}
