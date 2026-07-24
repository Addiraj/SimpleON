import { Router } from 'express';
import { WalletController } from '../controllers/wallet.controller.js';
import { optionalAuthenticateWeb3Token } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/summary', optionalAuthenticateWeb3Token, WalletController.getSummary);
router.get('/ledger', optionalAuthenticateWeb3Token, WalletController.getLedger);

export default router;
