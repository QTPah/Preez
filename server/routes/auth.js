const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1m' });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

router.post('/register', async (req, res) => {
  console.log('register');
  console.log(req.body);

  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username or email already exists' });
    }
    const user = new User({ username, email, password });
    await user.save();
    
    const { accessToken, refreshToken } = generateTokens(user._id);
    res.status(201).json({ 
      success: true, 
      accessToken, 
      refreshToken,
      user: { id: user._id, username: user.username, email: user.email } 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const { accessToken, refreshToken } = generateTokens(user._id);
    res.json({ 
      success: true, 
      accessToken, 
      refreshToken,
      user: { id: user._id, username: user.username, email: user.email } 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/logout', (req, res) => {
  console.log('logout');
  console.log(req.body);

  res.json({ success: true, message: 'Logout successful' });
});

router.get('/validate-token', authMiddleware, (req, res) => {
  res.json({ 
    success: true, 
    user: { id: req.user._id, username: req.user.username, email: req.user.email },
    accessToken: req.headers.authorization.split(' ')[1]
  });
});

router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ success: false, message: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);
    res.json({ success: true, accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
});

module.exports = router;
