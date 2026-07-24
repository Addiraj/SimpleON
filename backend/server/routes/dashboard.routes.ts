import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { optionalAuthenticateWeb3Token } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', optionalAuthenticateWeb3Token, DashboardController.getDashboard);
router.get('/summary', optionalAuthenticateWeb3Token, DashboardController.getSummary);
router.get('/recent-transactions', optionalAuthenticateWeb3Token, DashboardController.getRecentTransactions);

export default router;
