import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

const generateTokens = (user) => {
  console.log('Generating tokens for user:', user._id);
  const payload = {
    userId: user._id,
    permissions: user.permissions
  };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

router.post('/register', async (req, res) => {
  console.log('Register attempt:', req.body);
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    console.log('User registered:', user._id);
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
  console.log('Login attempt:', req.body.username);
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      console.log('Login failed: Invalid credentials');
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    console.log('User logged in:', user._id);
    const { accessToken, refreshToken } = generateTokens(user);
    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: { id: user._id, username: user.username, email: user.email, permissions: user.permissions }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/logout', authMiddleware, (req, res) => {
  console.log('User logged out:', req.user.id);
  // In a real-world scenario, you might want to invalidate the tokens here
  res.json({ success: true, message: 'Logged out successfully' });
});

router.post('/refresh-token', async (req, res) => {
  console.log('Refresh token attempt');
  const { refreshToken } = req.body;
  if (!refreshToken) {
    console.log('Refresh token missing');
    return res.status(401).json({ success: false, message: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    console.log('Refresh token valid for user:', decoded.userId);
    const { accessToken, refreshToken: newRefreshToken } = generateTokens({ _id: decoded.userId });
    res.json({ success: true, accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
});

router.get('/validate-token', authMiddleware, async (req, res) => {
  console.log('Token validation attempt for user:', req.user.id);
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      console.log('User not found during token validation');
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    console.log('Token validated successfully for user:', user._id);
    res.json({ success: true, user, accessToken: req.headers.authorization.split(' ')[1] });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/settings', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('settings');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, settings: user.settings });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/settings', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.settings = { ...user.settings, ...req.body };
    await user.save();
    res.json({ success: true, message: 'Settings updated successfully', settings: user.settings });
  } catch (error) {
    console.error('Error updating user settings:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
