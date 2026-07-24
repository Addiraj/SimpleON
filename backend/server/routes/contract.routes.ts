import { Router } from 'express';
import { ContractController } from '../controllers/contract.controller.js';

const router = Router();

router.get('/info', ContractController.getContractInfo);

export default router;
