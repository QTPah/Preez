const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ success: false, message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ success: false, message: 'Failed to authenticate token' });
    req.userId = decoded.userId;
    next();
  });
};

router.post('/:id/purchase', verifyToken, (req, res) => {
  // Here you would implement the logic to process the purchase
  // For now, we'll just return a success message
  res.json({ success: true, message: 'Purchase successful' });
});

module.exports = router;
