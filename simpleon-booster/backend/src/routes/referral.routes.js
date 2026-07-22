import { Router } from 'express';
import { getReferrals } from '../controllers/referral.controller.js';
const router = Router();
router.get('/', getReferrals);
export default router;