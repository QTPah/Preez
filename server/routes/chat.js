import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Message from '../models/Message.js';
import { createNotification } from '../utils/notificationUtils.js';

const router = express.Router();

// Get all users with unread message count and last message timestamp
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const users = await User.find({ _id: { $ne: currentUserId } }, 'username profilePicture');

    const usersWithMessageInfo = await Promise.all(users.map(async (user) => {
      const lastMessage = await Message.findOne({
        $or: [
          { sender: currentUserId, recipient: user._id },
          { sender: user._id, recipient: currentUserId }
        ]
      }).sort({ createdAt: -1 });

      const unreadCount = await Message.countDocuments({
        sender: user._id,
        recipient: currentUserId,
        seen: false
      });

      return {
        ...user.toObject(),
        unreadCount,
        lastMessageAt: lastMessage ? lastMessage.createdAt : null
      };
    }));

    // Sort users: unread messages first, then by last message timestamp
    usersWithMessageInfo.sort((a, b) => {
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
      if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
      return b.lastMessageAt - a.lastMessageAt;
    });

    res.json(usersWithMessageInfo);
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

    // Mark messages as seen
    await Message.updateMany(
      { sender: req.params.userId, recipient: req.user.id, seen: false },
      { $set: { seen: true, seenAt: new Date() } }
    );

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

    // Create a notification for the recipient
    const sender = await User.findById(req.user.id);
    await createNotification(
      userId,
      'message',
      'New Message',
      `You have a new message from ${sender.username}`
    );

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: 'Error sending message' });
  }
});

export default router;
