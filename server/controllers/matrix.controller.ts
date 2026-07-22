import { Request, Response, NextFunction } from 'express';
import { MatrixService } from '../services/MatrixService.js';

export class MatrixController {
  static get13LevelTree(req: Request, res: Response, next: NextFunction) {
    try {
      const address = (req.query.address as string) || '0x0000000000000000000000000000000000000000';
      const tree = MatrixService.get13LevelMatrixTree(address);
      res.json({ success: true, data: tree });
    } catch (err) {
      next(err);
    }
  }

  static getSpecialMatrices(req: Request, res: Response, next: NextFunction) {
    try {
      const address = (req.query.address as string) || '0x0000000000000000000000000000000000000000';
      const matrices = MatrixService.getSpecialMatrices(address);
      res.json({ success: true, data: matrices });
    } catch (err) {
      next(err);
    }
  }
}
