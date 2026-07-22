import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { UserService } from '../services/UserService.js';

export class UserController {
  static getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const address = req.userAddress || (req.query.address as string);
      if (!address) {
        res.status(400).json({ success: false, error: { message: 'Address required' } });
        return;
      }

      const profile = UserService.getUserProfile(address);
      res.json({ success: true, data: profile });
    } catch (err) {
      next(err);
    }
  }

  static updateBasePlan(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const address = req.userAddress;
      const { basePlanAmount } = req.body;

      if (!address) {
        res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
        return;
      }

      const updatedUser = UserService.updateBasePlan(address, Number(basePlanAmount));
      res.json({ success: true, data: updatedUser });
    } catch (err) {
      next(err);
    }
  }
}
