import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import NotificationPreset from '../models/NotificationPreset.js';
import logger from '../utils/logger.js';
import { sendNotification } from '../utils/notificationUtils.js';

const router = express.Router();

// Get all notifications for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('notifications');
    res.json({ success: true, notifications: user.notifications });
  } catch (error) {
    logger.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark a notification as read
router.patch('/:notificationId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user.id, 'notifications._id': req.params.notificationId },
      { $set: { 'notifications.$.read': true } },
      { new: true }
    ).select('notifications');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    logger.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all notification presets
router.get('/presets', authMiddleware, async (req, res) => {
  try {
    const presets = await NotificationPreset.find();
    res.json({ success: true, presets });
  } catch (error) {
    logger.error('Error fetching notification presets:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new notification preset
router.post('/presets', authMiddleware, async (req, res) => {
  try {
    const { type, title, message, defaultEnabled } = req.body;
    const preset = new NotificationPreset({ type, title, message, defaultEnabled });
    await preset.save();
    res.status(201).json({ success: true, preset });
  } catch (error) {
    logger.error('Error creating notification preset:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update a notification preset
router.put('/presets/:presetId', authMiddleware, async (req, res) => {
  try {
    const { type, title, message, defaultEnabled } = req.body;
    const preset = await NotificationPreset.findByIdAndUpdate(
      req.params.presetId,
      { type, title, message, defaultEnabled },
      { new: true }
    );
    if (!preset) {
      return res.status(404).json({ success: false, message: 'Preset not found' });
    }
    res.json({ success: true, preset });
  } catch (error) {
    logger.error('Error updating notification preset:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a notification preset
router.delete('/presets/:presetId', authMiddleware, async (req, res) => {
  try {
    const preset = await NotificationPreset.findByIdAndDelete(req.params.presetId);
    if (!preset) {
      return res.status(404).json({ success: false, message: 'Preset not found' });
    }
    res.json({ success: true, message: 'Preset deleted successfully' });
  } catch (error) {
    logger.error('Error deleting notification preset:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user's notification preferences
router.put('/preferences', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { notificationPreferences: req.body } },
      { new: true }
    ).select('notificationPreferences');

    res.json({ success: true, preferences: user.notificationPreferences });
  } catch (error) {
    logger.error('Error updating notification preferences:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send a manual notification
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { type, title, message, recipients } = req.body;
    
    if (!Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ success: false, message: 'Recipients must be a non-empty array of user IDs' });
    }

    for (const userId of recipients) {
      await sendNotification(userId, type, { title, message });
    }

    res.json({ success: true, message: 'Notifications sent successfully' });
  } catch (error) {
    logger.error('Error sending manual notification:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
