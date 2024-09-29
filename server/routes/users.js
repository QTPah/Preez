import express from 'express';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Get all users (only accessible by admin)
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (!req.user.permissions.includes('manageUsers')) {
      return res.status(403).json({ success: false, message: 'Not authorized to view all users' });
    }
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add a new user (only accessible by admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (!req.user.permissions.includes('manageUsers')) {
      return res.status(403).json({ success: false, message: 'Not authorized to add users' });
    }
    const { username, email, password, permissions } = req.body;
    const user = new User({ username, email, password, permissions });
    await user.save();
    res.status(201).json({ success: true, user: user.toObject({ versionKey: false, transform: (doc, ret) => { delete ret.password; return ret; } }) });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update a user (only accessible by admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (!req.user.permissions.includes('manageUsers')) {
      return res.status(403).json({ success: false, message: 'Not authorized to update users' });
    }
    const { username, email, permissions, newPermission } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.username = username;
    user.email = email;
    user.permissions = permissions;
    if (newPermission && !user.permissions.includes(newPermission)) {
      user.permissions.push(newPermission);
    }
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }
    await user.save();
    res.json({ success: true, user: user.toObject({ versionKey: false, transform: (doc, ret) => { delete ret.password; return ret; } }) });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete a user (only accessible by admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (!req.user.permissions.includes('manageUsers')) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete users' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
