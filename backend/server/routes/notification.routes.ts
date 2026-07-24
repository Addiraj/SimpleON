import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller.js';
import { optionalAuthenticateWeb3Token } from '../middlewares/authMiddleware.js';

const router = Router();

// Use optional authentication middleware to resolve JWT token or fallback address headers/queries
router.use(optionalAuthenticateWeb3Token);

// GET /api/notifications
router.get('/', NotificationController.getNotifications);

// GET /api/notifications/unread-count
router.get('/unread-count', NotificationController.getUnreadCount);

// PATCH /api/notifications/read-all
router.patch('/read-all', NotificationController.markAllAsRead);

// PATCH /api/notifications/:id/read
router.patch('/:id/read', NotificationController.markAsRead);

export default router;
