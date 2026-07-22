import { Router } from 'express';
import { joinBooster } from '../controllers/booster.controller.js';
const router = Router();
router.post('/join', joinBooster);
export default router;