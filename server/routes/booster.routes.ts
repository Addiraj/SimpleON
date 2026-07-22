import { Router } from 'express';
import { BoosterController } from '../controllers/booster.controller.js';
import { authenticateWeb3Token } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/calculations', BoosterController.getCalculations);
router.post('/upgrade', authenticateWeb3Token, BoosterController.upgradeTier);

export default router;
