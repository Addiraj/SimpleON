import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/DashboardService.js';
import { logger } from '../config/logger.js';

export class DashboardController {
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      const walletAddress =
        (req as any).userAddress ||
        (req.query.address as string) ||
        (req.query.walletAddress as string) ||
        (req.headers['x-wallet-address'] as string);
      const hostHeader = req.headers.host;

      const data = await DashboardService.getDashboard(userId, walletAddress, hostHeader);

      return res.status(200).json({
        success: true,
        status: 'success',
        data,
      });
    } catch (err: any) {
      logger.error({ error: err.message }, '[DashboardController] Error fetching dashboard data');
      next(err);
    }
  }

  static async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      const walletAddress =
        (req as any).userAddress ||
        (req.query.address as string) ||
        (req.query.walletAddress as string) ||
        (req.headers['x-wallet-address'] as string);
      const hostHeader = req.headers.host;

      const data = await DashboardService.getSummary(userId, walletAddress, hostHeader);

      return res.status(200).json({
        success: true,
        status: 'success',
        data,
      });
    } catch (err: any) {
      logger.error({ error: err.message }, '[DashboardController] Error fetching dashboard summary');
      next(err);
    }
  }

  static async getRecentTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      const walletAddress =
        (req as any).userAddress ||
        (req.query.address as string) ||
        (req.query.walletAddress as string) ||
        (req.headers['x-wallet-address'] as string);
      const limit = parseInt((req.query.limit as string) || '10', 10);

      const data = await DashboardService.getRecentTransactions(userId, walletAddress, limit);

      return res.status(200).json({
        success: true,
        status: 'success',
        data,
      });
    } catch (err: any) {
      logger.error({ error: err.message }, '[DashboardController] Error fetching dashboard recent transactions');
      next(err);
    }
  }
}
