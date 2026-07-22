import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { BoosterService } from '../services/BoosterService.js';

export class BoosterController {
  static getCalculations(req: Request, res: Response, next: NextFunction) {
    try {
      const basePlan = req.query.basePlan ? Number(req.query.basePlan) : 1.0;
      const calculations = BoosterService.getBoosterCalculations(basePlan);
      res.json({ success: true, data: calculations });
    } catch (err) {
      next(err);
    }
  }

  static upgradeTier(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const address = req.userAddress;
      const { targetTier } = req.body;

      if (!address) {
        res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
        return;
      }

      const result = BoosterService.upgradeUserBoosterTier(address, targetTier);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}
