import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { createNotification, getUnreadNotifications, markNotificationAsRead } from '../utils/notificationUtils.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('notification-routes');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await getUnreadNotifications(req.user.id);
    res.json(notifications);
  } catch (error) {
    logger.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { type, title, message } = req.body;
  try {
    const notification = await createNotification(req.user.id, type, title, message);
    res.status(201).json(notification);
  } catch (error) {
    logger.error('Error creating notification:', error);
    res.status(500).json({ message: 'Error creating notification' });
  }
});

router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notification = await markNotificationAsRead(req.params.id);
    res.json(notification);
  } catch (error) {
    logger.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Error marking notification as read' });
  }
});

export default router;
