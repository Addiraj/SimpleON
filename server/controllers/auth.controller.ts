import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService.js';

export class AuthController {
  /**
   * Request cryptographic SIWE auth nonce for wallet
   */
  static getNonce(req: Request, res: Response, next: NextFunction) {
    try {
      const { address } = req.query;
      if (!address || typeof address !== 'string') {
        res.status(400).json({ success: false, error: { message: 'Wallet address query parameter is required' } });
        return;
      }

      const nonceData = AuthService.generateNonce(address);
      res.json({ success: true, data: nonceData });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Verify signature and log in wallet
   */
  static verifySignature(req: Request, res: Response, next: NextFunction) {
    try {
      const { address, signature, message, referrerAddress } = req.body;
      if (!address || !signature || !message) {
        res.status(400).json({
          success: false,
          error: { message: 'address, signature, and message are required' }
        });
        return;
      }

      const result = AuthService.verifySignature(address, signature, message, referrerAddress);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(401).json({ success: false, error: { message: err.message || 'Verification failed' } });
    }
  }
}
