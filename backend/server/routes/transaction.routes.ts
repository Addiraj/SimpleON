import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller.js';
import { optionalAuthenticateWeb3Token } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', optionalAuthenticateWeb3Token, TransactionController.getTransactions);
router.get('/export', optionalAuthenticateWeb3Token, TransactionController.exportTransactions);
router.get('/:id', optionalAuthenticateWeb3Token, TransactionController.getTransactionById);

export default router;
