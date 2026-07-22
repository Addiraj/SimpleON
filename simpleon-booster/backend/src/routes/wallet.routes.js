import { Router } from 'express';
import { connectWallet, disconnectWallet } from '../controllers/wallet.controller.js';

const router = Router();

router.post('/connect', connectWallet);
router.post('/disconnect', disconnectWallet);

export default router;
