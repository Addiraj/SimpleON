import { Request, Response, NextFunction } from 'express';
<<<<<<< HEAD
import { JwtUtil } from '../utils/jwt.util.js';
import { AuthRepository } from '../repositories/AuthRepository.js';

export interface AuthRequest extends Request {
  userId?: string;
  userAddress?: string;
}

export const authenticateWeb3Token = async (
=======
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export interface AuthRequest extends Request {
  userAddress?: string;
}

export const authenticateWeb3Token = (
>>>>>>> fe05ef7be215c289d9c2e81e5d2ca052e3956485
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
<<<<<<< HEAD
      error: { message: 'Authentication token missing or invalid', statusCode: 401 }
=======
      error: { message: 'Authentication token missing or invalid' }
>>>>>>> fe05ef7be215c289d9c2e81e5d2ca052e3956485
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
<<<<<<< HEAD
    const payload = JwtUtil.verifyAccessToken(token);
    req.userId = payload.userId;
    req.userAddress = payload.walletAddress;

    if (payload.userId) {
      const user = await AuthRepository.findUserById(payload.userId);
      if (user && (user.status === 'SUSPENDED' || user.status === 'BLOCKED')) {
        res.status(403).json({
          success: false,
          error: { message: 'Account is suspended or blocked', statusCode: 403 }
        });
        return;
      }
    }

=======
    const decoded = jwt.verify(token, config.jwtSecret) as { address: string };
    req.userAddress = decoded.address.toLowerCase();
>>>>>>> fe05ef7be215c289d9c2e81e5d2ca052e3956485
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
<<<<<<< HEAD
      error: { message: 'Invalid or expired Web3 authentication session token', statusCode: 401 }
    });
  }
};

export const optionalAuthenticateWeb3Token = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const payload = JwtUtil.verifyAccessToken(token);
      req.userId = payload.userId;
      req.userAddress = payload.walletAddress;
    } catch {
      // Ignore invalid token for optional auth
    }
  }

  next();
};

export default authenticateWeb3Token;
=======
      error: { message: 'Invalid or expired Web3 authentication session token' }
    });
  }
};
>>>>>>> fe05ef7be215c289d9c2e81e5d2ca052e3956485
