import express from 'express';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';
import bcrypt from 'bcryptjs';
import { getAllUserReports, updateUserReportStatus } from '../controllers/usersController.js';

const router = express.Router();

// New routes for user view
router.get('/reports', authMiddleware, getAllUserReports);
router.patch('/reports/:reportId', authMiddleware, updateUserReportStatus);

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

import Report from '../models/Report.js';

// ... (keep existing code)

// Report a user
router.post('/:id/report', authMiddleware, async (req, res) => {
  try {
    const userToReport = await User.findById(req.params.id);
    if (!userToReport) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const { reason, description } = req.body;
    
    const report = new Report({
      reportType: 'user',
      targetId: userToReport._id,
      reportedBy: req.user.id,
      reason,
      description
    });
    
    await report.save();
    
    console.log(`User ${req.params.id} reported by user ${req.user.id}. Report ID: ${report._id}`);
    
    res.json({ success: true, message: 'Report submitted successfully' });
  } catch (error) {
    console.error(`Error reporting user ${req.params.id}:`, error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get all reports (only accessible by admin)
router.get('/reports', authMiddleware, async (req, res) => {
  try {
    if (!req.user.permissions.includes('viewReports')) {
      return res.status(403).json({ success: false, message: 'Not authorized to view reports' });
    }
    const reports = await Report.find()
      .populate('reportedBy', 'username')
      .populate('targetId', 'username title');
    res.json({ success: true, reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update report status
router.patch('/reports/:reportId', authMiddleware, async (req, res) => {
  try {
    if (!req.user.permissions.includes('manageReports')) {
      return res.status(403).json({ success: false, message: 'Not authorized to manage reports' });
    }

    const { reportId } = req.params;
    const { action } = req.body;

    if (!['resolve', 'reject'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Invalid action' });
    }

    const report = await Report.findByIdAndUpdate(
      reportId,
      { status: action === 'resolve' ? 'resolved' : 'rejected' },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.json({ success: true, report });
  } catch (error) {
    console.error('Error updating report status:', error);
    res.status(500).json({ success: false, message: 'Error updating report status', error: error.message });
  }
});

export default router;
