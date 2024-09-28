const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const authMiddleware = require('../middleware/authMiddleware');

// Get all offers
router.get('/', async (req, res) => {
  try {
    const offers = await Offer.find().populate('seller', 'username');
    res.json({ success: true, offers });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get a specific offer
router.get('/:id', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id).populate('seller', 'username');
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }
    res.json({ success: true, offer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Create a new offer
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, price, category, tags } = req.body;
    const offer = new Offer({
      title,
      description,
      price,
      category,
      tags,
      seller: req.user.id
    });
    await offer.save();
    res.status(201).json({ success: true, offer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update an offer
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }
    if (offer.seller.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this offer' });
    }
    Object.assign(offer, req.body);
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
    if (offer.seller.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this offer' });
    }
    await offer.remove();
    res.json({ success: true, message: 'Offer deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
