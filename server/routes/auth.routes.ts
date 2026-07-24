import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
<<<<<<< HEAD
import { validateRequest } from '../middlewares/validateRequest.js';
import { authenticateWeb3Token } from '../middlewares/authMiddleware.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import {
  getNonceSchema,
  verifySignatureSchema,
  refreshTokenSchema,
  logoutSchema,
} from '../validators/auth.validator.js';

const router = Router();

// Nonce generation
router.post('/nonce', authLimiter, validateRequest(getNonceSchema), AuthController.getNonce);
router.get('/nonce', authLimiter, AuthController.getNonce); // GET support for backward compatibility

// SIWE signature verification & user login
router.post('/verify', authLimiter, validateRequest(verifySignatureSchema), AuthController.verifySignature);

// Refresh token rotation
router.post('/refresh', authLimiter, validateRequest(refreshTokenSchema), AuthController.refreshToken);

// Session revocation
router.post('/logout', validateRequest(logoutSchema), AuthController.logout);

// Current user profile
router.get('/me', authenticateWeb3Token, AuthController.getCurrentUser);
=======

const router = Router();

router.get('/nonce', AuthController.getNonce);
router.post('/verify', AuthController.verifySignature);
>>>>>>> fe05ef7be215c289d9c2e81e5d2ca052e3956485

export default router;
