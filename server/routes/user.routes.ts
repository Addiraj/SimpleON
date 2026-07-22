import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authenticateWeb3Token } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/profile', UserController.getProfile);
router.post('/base-plan', authenticateWeb3Token, UserController.updateBasePlan);

export default router;
