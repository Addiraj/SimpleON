import { Router } from 'express';
import { StatsController } from '../controllers/stats.controller.js';

const router = Router();

router.get('/global', StatsController.getGlobalStats);

export default router;
