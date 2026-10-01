import express from 'express';
import { getNotifications, markNotificationRead } from '../controllers/notificationController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, getNotifications);
router.patch('/:id/read', optionalAuth, markNotificationRead);

export default router;
