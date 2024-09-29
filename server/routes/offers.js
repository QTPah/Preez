import express from 'express';
import Offer from '../models/Offer.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all offers
router.get('/', async (req, res) => {
  console.log('GET /api/offers - Fetching all offers');
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Offer.countDocuments();
    console.log(`Total offers: ${total}`);
    const offers = await Offer.find()
      .populate('seller', 'username')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    console.log(`Fetched ${offers.length} offers for page ${page}`);
    res.json({
      success: true,
      offers,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalOffers: total
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get a specific offer
router.get('/:id', async (req, res) => {
  console.log(`GET /api/offers/${req.params.id} - Fetching specific offer`);
  try {
    const offer = await Offer.findById(req.params.id).populate('seller', 'username');
    if (!offer) {
      console.log(`Offer not found: ${req.params.id}`);
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }
    console.log(`Offer found: ${offer._id}`);
    res.json({ success: true, offer });
  } catch (error) {
    console.error(`Error fetching offer ${req.params.id}:`, error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Create a new offer
router.post('/', authMiddleware, async (req, res) => {
  console.log('POST /api/offers - Creating new offer');
  try {
    if (!req.user.permissions.includes('createOffer')) {
      console.log(`User ${req.user.id} attempted to create offer without permission`);
      return res.status(403).json({ success: false, message: 'You do not have permission to create offers' });
    }
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
    console.log(`New offer created: ${offer._id}`);
    res.status(201).json({ success: true, offer });
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update an offer
router.put('/:id', authMiddleware, async (req, res) => {
  console.log(`PUT /api/offers/${req.params.id} - Updating offer`);
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      console.log(`Offer not found: ${req.params.id}`);
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }
    if (offer.seller.toString() !== req.user.id && !req.user.permissions.includes('editAnyOffer')) {
      console.log(`User ${req.user.id} attempted to update offer ${offer._id} without permission`);
      return res.status(403).json({ success: false, message: 'Not authorized to update this offer' });
    }
    Object.assign(offer, req.body);
    await offer.save();
    console.log(`Offer updated: ${offer._id}`);
    res.json({ success: true, offer });
  } catch (error) {
    console.error(`Error updating offer ${req.params.id}:`, error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete an offer
router.delete('/:id', authMiddleware, async (req, res) => {
  console.log(`DELETE /api/offers/${req.params.id} - Deleting offer`);
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      console.log(`Offer not found: ${req.params.id}`);
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }
    if (offer.seller.toString() !== req.user.id && !req.user.permissions.includes('deleteAnyOffer')) {
      console.log(`User ${req.user.id} attempted to delete offer ${offer._id} without permission`);
      return res.status(403).json({ success: false, message: 'Not authorized to delete this offer' });
    }
    await offer.deleteOne();
    console.log(`Offer deleted: ${offer._id}`);
    res.json({ success: true, message: 'Offer deleted successfully' });
  } catch (error) {
    console.error(`Error deleting offer ${req.params.id}:`, error);
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
