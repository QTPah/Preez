import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';
import logger from '../utils/logger.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads/';
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    cb(null, `pfp-${req.user.id}${extension}`);
  }
});

const upload = multer({ storage: storage });

const generateTokens = (user) => {
  logger.info('Generating tokens for user: ' + user._id);
  const payload = {
    userId: user._id,
    permissions: user.permissions
  };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

router.post('/register', async (req, res) => {
  logger.info('Register attempt: ' + JSON.stringify(req.body));
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    logger.info('User registered: ' + user._id);
    const { accessToken, refreshToken } = generateTokens(user);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      accessToken,
      refreshToken,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/login', async (req, res) => {
  logger.info('Login attempt: ' + req.body.username);
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      logger.warn('Login failed: Invalid credentials');
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    logger.info('User logged in: ' + user._id);
    const { accessToken, refreshToken } = generateTokens(user);
    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        permissions: {
          createOffer: user.permissions.createOffer,
          editAnyOffer: user.permissions.editAnyOffer,
          deleteAnyOffer: user.permissions.deleteAnyOffer,
          adminAccess: user.permissions.adminAccess,
          manageUsers: user.permissions.manageUsers,
          manageOffers: user.permissions.manageOffers,
          manageCategories: user.permissions.manageCategories,
          viewReports: user.permissions.viewReports,
          manageSettings: user.permissions.manageSettings
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/logout', authMiddleware, (req, res) => {
  logger.info('User logged out: ' + req.user.id);
  // In a real-world scenario, you might want to invalidate the tokens here
  res.json({ success: true, message: 'Logged out successfully' });
});

router.post('/refresh-token', async (req, res) => {
  logger.info('Refresh token attempt');
  const { refreshToken } = req.body;
  if (!refreshToken) {
    logger.warn('Refresh token missing');
    return res.status(401).json({ success: false, message: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    logger.info('Refresh token valid for user: ' + decoded.userId);
    const { accessToken, refreshToken: newRefreshToken } = generateTokens({ _id: decoded.userId });
    res.json({ success: true, accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    logger.error('Refresh token error:', error);
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
});

router.get('/validate-token', authMiddleware, async (req, res) => {
  logger.info('Token validation attempt for user: ' + req.user.id);
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      logger.warn('User not found during token validation');
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    logger.info('Token validated successfully for user: ' + user._id);
    res.json({ success: true, user, accessToken: req.headers.authorization.split(' ')[1] });
  } catch (error) {
    logger.error('Token validation error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/settings', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('settings');
    if (!user) {
      logger.warn('User not found when fetching settings: ' + req.user.id);
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    logger.info('Settings fetched for user: ' + req.user.id);
    res.json({ success: true, settings: user.settings });
  } catch (error) {
    logger.error('Error fetching user settings:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/settings', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      logger.warn('User not found when updating settings: ' + req.user.id);
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.settings = { ...user.settings, ...req.body };
    await user.save();
    logger.info('Settings updated for user: ' + req.user.id);
    res.json({ success: true, message: 'Settings updated successfully', settings: user.settings });
  } catch (error) {
    logger.error('Error updating user settings:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      logger.warn('User not found when changing password: ' + req.user.id);
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      logger.warn('Incorrect current password for user: ' + req.user.id);
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    logger.info('Password changed successfully for user: ' + req.user.id);
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    logger.error('Error changing password:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/profile', authMiddleware, upload.single('profilePicture'), async (req, res) => {
  try {
    const { username, email, bio, deleteProfilePicture } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      logger.warn('User not found when updating profile: ' + req.user.id);
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.username = username;
    user.email = email;
    user.bio = bio;
    if (req.file) {
      user.profilePicture = req.file.path;
    } else if (deleteProfilePicture) {
      if (user.profilePicture) {
        const filePath = path.join(process.cwd(), user.profilePicture);
        fs.unlink(filePath, (err) => {
          if (err) logger.error('Error deleting profile picture: ' + err);
        });
        user.profilePicture = '';
      }
    }

    await user.save();
    logger.info('Profile updated successfully for user: ' + req.user.id);
    res.json({ 
      success: true, 
      message: 'Profile updated successfully', 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        bio: user.bio,
        profilePicture: user.profilePicture
      } 
    });
  } catch (error) {
    logger.error('Error updating profile:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/profile-picture', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      logger.warn('User not found when deleting profile picture: ' + req.user.id);
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.profilePicture) {
      const filePath = path.join(process.cwd(), user.profilePicture);
      fs.unlink(filePath, (err) => {
        if (err) logger.error('Error deleting profile picture:', err);
      });
      user.profilePicture = '';
      await user.save();
    }
    logger.info('Profile picture deleted successfully for user: ' + req.user.id);
    res.json({ 
      success: true, 
      message: 'Profile picture deleted successfully', 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        bio: user.bio,
        profilePicture: user.profilePicture
      } 
    });
  } catch (error) {
    logger.error('Error deleting profile picture:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
