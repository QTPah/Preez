import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Message from '../models/Message.js';

const router = express.Router();

// Get all users
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, 'username profilePicture');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
});

// Get messages between current user and another user
router.get('/messages/:userId', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user.id }
      ]
    }).sort('createdAt');
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'Error fetching messages' });
  }
});

// Send a message
router.post('/messages', authMiddleware, async (req, res) => {
  try {
    const { userId, text } = req.body;
    const message = new Message({
      sender: req.user.id,
      recipient: userId,
      text
    });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: 'Error sending message' });
  }
});

export default router;
