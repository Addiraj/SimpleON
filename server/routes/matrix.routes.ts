import { Router } from 'express';
import { MatrixController } from '../controllers/matrix.controller.js';

const router = Router();

router.get('/13-level-tree', MatrixController.get13LevelTree);
router.get('/special-matrices', MatrixController.getSpecialMatrices);

export default router;
