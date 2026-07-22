import { Router } from 'express';
import walletRoutes from './wallet.routes.js';
import referralRoutes from './referral.routes.js';
import boosterRoutes from './booster.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import healthRoutes from './health.routes.js';

const router = Router();

router.use('/wallet', walletRoutes);
router.use('/referral', referralRoutes);
router.use('/booster', boosterRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/health', healthRoutes);

export default router;
