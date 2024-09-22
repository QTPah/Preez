const express = require('express');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get all unread notifications for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id, read: false }).sort('-createdAt');
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark a notification as read
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, user: req.user._id });
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();
    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
