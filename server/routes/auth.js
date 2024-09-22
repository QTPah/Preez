const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

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
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const sessionData = { token, user: { id: user._id, username: user.username, email: user.email } };
    res.cookie('session', JSON.stringify(sessionData), { httpOnly: true, maxAge: 3600000 }); // 1 hour
    res.status(201).json({ success: true, user: { id: user._id, username: user.username, email: user.email } });
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
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const sessionData = { token, user: { id: user._id, username: user.username, email: user.email } };
    res.cookie('session', JSON.stringify(sessionData), { httpOnly: true, maxAge: 3600000 }); // 1 hour
    res.json({ success: true, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/logout', (req, res) => {
  console.log('logout');
  console.log(req.body);

  res.clearCookie('session');
  res.json({ success: true, message: 'Logout successful' });
});

module.exports = router;
