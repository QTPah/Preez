const express = require('express');
const jwt = require('jsonwebtoken');
const Offer = require('../models/Offer');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Get all offers
router.get('/', async (req, res) => {
  try {
    const offers = await Offer.find({ status: 'active' }).populate('user', 'username');
    res.json({ success: true, offers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new offer
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const offer = new Offer({
      title,
      description,
      price,
      category,
      user: req.user._id
    });
    await offer.save();
    res.status(201).json({ success: true, offer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get a specific offer
router.get('/:id', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id).populate('user', 'username');
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }
    res.json({ success: true, offer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update an offer
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }
    if (offer.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You are not authorized to update this offer' });
    }
    const { title, description, price, category, status } = req.body;
    offer.title = title || offer.title;
    offer.description = description || offer.description;
    offer.price = price || offer.price;
    offer.category = category || offer.category;
    offer.status = status || offer.status;
    offer.updatedAt = Date.now();
    await offer.save();
    res.json({ success: true, offer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete an offer
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }
    if (offer.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You are not authorized to delete this offer' });
    }
    await offer.remove();
    res.json({ success: true, message: 'Offer deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:id/purchase', authMiddleware, async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    // Here you would implement the logic to process the purchase
    // For now, we'll just update the offer status and create a notification

    offer.status = 'sold';
    await offer.save();

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
