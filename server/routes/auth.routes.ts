import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';

const router = Router();

router.get('/nonce', AuthController.getNonce);
router.post('/verify', AuthController.verifySignature);

export default router;
