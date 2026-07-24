import { Router } from 'express';
import { UpgradeController } from '../controllers/upgrade.controller.js';
import { optionalAuthenticateWeb3Token } from '../middlewares/authMiddleware.js';

const router = Router();

// Upgrade APIs
router.get('/eligibility', optionalAuthenticateWeb3Token, UpgradeController.getEligibility);
router.get('/history', optionalAuthenticateWeb3Token, UpgradeController.getHistory);
router.post('/execute', optionalAuthenticateWeb3Token, UpgradeController.executeUpgrade);
router.post('/create-payment-intent', optionalAuthenticateWeb3Token, UpgradeController.createPaymentIntent);

export default router;
