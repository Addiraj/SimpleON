import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authenticateWeb3Token } from '../middlewares/authMiddleware.js';
<<<<<<< HEAD
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  updateProfileSchema,
  updatePreferencesSchema,
} from '../validators/user.validator.js';

const router = Router();

// Profile endpoints
router.get('/profile', authenticateWeb3Token, UserController.getProfile);
router.patch('/profile', authenticateWeb3Token, validateRequest(updateProfileSchema), UserController.updateProfile);
router.put('/profile', authenticateWeb3Token, validateRequest(updateProfileSchema), UserController.updateProfile);

// Preferences endpoints
router.get('/preferences', authenticateWeb3Token, UserController.getPreferences);
router.patch('/preferences', authenticateWeb3Token, validateRequest(updatePreferencesSchema), UserController.updatePreferences);
router.put('/preferences', authenticateWeb3Token, validateRequest(updatePreferencesSchema), UserController.updatePreferences);

// Base plan legacy route
=======

const router = Router();

router.get('/profile', UserController.getProfile);
>>>>>>> fe05ef7be215c289d9c2e81e5d2ca052e3956485
router.post('/base-plan', authenticateWeb3Token, UserController.updateBasePlan);

export default router;
