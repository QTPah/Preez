const express = require('express');
const jwt = require('jsonwebtoken');
const Offer = require('../models/Offer');
const Notification = require('../models/Notification');
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

router.post('/:id/purchase', verifyToken, async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    // Here you would implement the logic to process the purchase
    // For now, we'll just create a notification

    const notification = new Notification({
      title: 'Offer Purchased',
      message: `Your offer "${offer.title}" has been purchased`,
      user: offer.user
    });
    await notification.save();

    res.json({ success: true, message: 'Purchase successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
