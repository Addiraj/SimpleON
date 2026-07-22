import { Router } from 'express';
import { connectWallet } from '../controllers/wallet.controller.js';
const router = Router();
router.post('/connect', connectWallet);
export default router;