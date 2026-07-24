import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService.js';

export class StatsController {
  static getGlobalStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const allUsers = AuthService.getAllUsers();
      const totalUsersCount = allUsers.length;
      const totalUsdtDistributed = allUsers.reduce((sum, u) => sum + u.totalEarningsUsdt, 0);

      res.json({
        success: true,
        data: {
          totalUsers: totalUsersCount + 18240, // Simulated network base + active
          totalUsdtDistributed: totalUsdtDistributed + 894200.0,
          activeBoosterCycles: 4580,
          currentNetworkStatus: 'OPERATIONAL',
          supportedChains: ['BNB Chain Testnet (97)', 'BNB Chain Mainnet (56)'],
          timestamp: new Date().toISOString()
        }
      });
    } catch (err) {
      next(err);
    }
  }
}
