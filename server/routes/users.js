import express from 'express';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all users (only accessible by admin)
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (!req.user.permissions.manageUsers) {
      return res.status(403).json({ success: false, message: 'Not authorized to view all users' });
    }
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
