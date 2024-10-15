import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { checkPermission } from '../middleware/permissionMiddleware.js';
import User from '../models/User.js';
import NotificationPreset from '../models/NotificationPreset.js';
import NotificationScript from '../models/NotificationScript.js';
import logger from '../utils/logger.js';
import { sendNotification, executeNotificationScript } from '../utils/notificationUtils.js';

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
router.get('/presets', authMiddleware, checkPermission(['editPresets', 'devPresets']), async (req, res) => {
  try {
    const presets = await NotificationPreset.find();
    res.json({ success: true, presets });
  } catch (error) {
    logger.error('Error fetching notification presets:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new notification preset
router.post('/presets', authMiddleware, checkPermission('devPresets'), async (req, res) => {
  try {
    const { type, title, message, defaultEnabled, redirectLink } = req.body;
    const preset = new NotificationPreset({ type, title, message, defaultEnabled, redirectLink });
    await preset.save();
    res.status(201).json({ success: true, preset });
  } catch (error) {
    logger.error('Error creating notification preset:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update a notification preset
router.put('/presets/:presetId', authMiddleware, checkPermission('editPresets'), async (req, res) => {
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
router.delete('/presets/:presetId', authMiddleware, checkPermission('devPresets'), async (req, res) => {
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

// Get all notification scripts
router.get('/scripts', authMiddleware, checkPermission(['editPresets', 'devPresets']), async (req, res) => {
  try {
    const scripts = await NotificationScript.find().populate('createdBy', 'username');
    res.json({ success: true, scripts });
  } catch (error) {
    logger.error('Error fetching notification scripts:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new notification script
router.post('/scripts', authMiddleware, checkPermission('devPresets'), async (req, res) => {
  try {
    const { name, description, code } = req.body;
    const script = new NotificationScript({ name, description, code, createdBy: req.user.id });
    await script.save();
    res.status(201).json({ success: true, script });
  } catch (error) {
    logger.error('Error creating notification script:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update a notification script
router.put('/scripts/:scriptId', authMiddleware, checkPermission('devPresets'), async (req, res) => {
  try {
    const { name, description, code } = req.body;
    const script = await NotificationScript.findByIdAndUpdate(
      req.params.scriptId,
      { name, description, code, updatedAt: Date.now() },
      { new: true }
    );
    if (!script) {
      return res.status(404).json({ success: false, message: 'Script not found' });
    }
    res.json({ success: true, script });
  } catch (error) {
    logger.error('Error updating notification script:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete a notification script
router.delete('/scripts/:scriptId', authMiddleware, checkPermission('devPresets'), async (req, res) => {
  try {
    const script = await NotificationScript.findByIdAndDelete(req.params.scriptId);
    if (!script) {
      return res.status(404).json({ success: false, message: 'Script not found' });
    }
    res.json({ success: true, message: 'Script deleted successfully' });
  } catch (error) {
    logger.error('Error deleting notification script:', error);
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
router.post('/send', authMiddleware, checkPermission('sendNotifications'), async (req, res) => {
  try {
    const { type, title, message } = req.body;
    const recipients = req.body.recipients.split(',').map(id => id.trim());
    
    if (!Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ success: false, message: 'Recipients must be a non-empty array of user IDs' });
    }

    for (const userId of recipients) {
      await sendNotification(userId, type, { title, message });
    }

    res.json({ success: true, message: 'Notifications sent successfully' });
  } catch (error) {
    logger.error('Error sending manual notification: '+ error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/presets/:presetId/mute', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.mutedPresets.includes(req.params.presetId)) {
      user.mutedPresets.push(req.params.presetId);
      await user.save();
    }

    res.json({ success: true, message: 'Preset muted successfully' });
  } catch (error) {
    logger.error('Error muting preset:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/presets/:presetId/unmute', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.mutedPresets = user.mutedPresets.filter(id => id.toString() !== req.params.presetId);
    await user.save();

    res.json({ success: true, message: 'Preset unmuted successfully' });
  } catch (error) {
    logger.error('Error unmuting preset:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
