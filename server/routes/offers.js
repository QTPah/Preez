import express from 'express';
import Offer from '../models/Offer.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { getAllOfferReports, updateOfferReportStatus } from '../controllers/offerController.js';
import { createLogger } from '../utils/logger.js';

const router = express.Router();
const logger = createLogger('offer-routes');


// New routes for offer reports
router.get('/reports', authMiddleware, getAllOfferReports);
router.patch('/reports/:reportId', authMiddleware, updateOfferReportStatus);

// Get all offers
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Offer.countDocuments();
    const offers = await Offer.find()
      .populate('seller', 'username _id')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.json({
      success: true,
      offers,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalOffers: total
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching offers');
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get a specific offer
router.get('/:id', async (req, res) => {
  logger.debug(`GET /api/offers/${req.params.id} - Fetching specific offer`);
  try {
    const offer = await Offer.findById(req.params.id).populate('seller', 'username');
    if (!offer) {
      logger.warn(`Offer not found: ${req.params.id}`);
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }
    logger.debug(`Offer found: ${offer._id}`);
    res.json({ success: true, offer });
  } catch (error) {
    logger.error({ err: error }, `Error fetching offer ${req.params.id}`);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Create a new offer
router.post('/', authMiddleware, async (req, res) => {
  logger.debug('POST /api/offers - Creating new offer');
  try {
    if (!req.user.permissions.includes('createOffer')) {
      logger.warn(`User ${req.user.id} attempted to create offer without permission`);
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
    logger.info(`New offer created: ${offer._id}`);
    res.status(201).json({ success: true, offer });
  } catch (error) {
    logger.error({ err: error }, 'Error creating offer');
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update an offer
router.put('/:id', authMiddleware, async (req, res) => {
  logger.debug(`PUT /api/offers/${req.params.id} - Updating offer`);
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      logger.warn(`Offer not found: ${req.params.id}`);
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }
    if (offer.seller.toString() !== req.user.id && !req.user.permissions.includes('editAnyOffer')) {
      logger.warn(`User ${req.user.id} attempted to update offer ${offer._id} without permission`);
      return res.status(403).json({ success: false, message: 'Not authorized to update this offer' });
    }
    Object.assign(offer, req.body);
    await offer.save();
    logger.info(`Offer updated: ${offer._id}`);
    res.json({ success: true, offer });
  } catch (error) {
    logger.error({ err: error }, `Error updating offer ${req.params.id}`);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete an offer
router.delete('/:id', authMiddleware, async (req, res) => {
  logger.debug(`DELETE /api/offers/${req.params.id} - Deleting offer`);
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      logger.warn(`Offer not found: ${req.params.id}`);
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }
    if (offer.seller.toString() !== req.user.id && !req.user.permissions.includes('deleteAnyOffer')) {
      logger.warn(`User ${req.user.id} attempted to delete offer ${offer._id} without permission`);
      return res.status(403).json({ success: false, message: 'Not authorized to delete this offer' });
    }
    await offer.deleteOne();
    logger.info(`Offer deleted: ${offer._id}`);
    res.json({ success: true, message: 'Offer deleted successfully' });
  } catch (error) {
    logger.error({ err: error }, `Error deleting offer ${req.params.id}`);
    res.status(400).json({ success: false, message: error.message });
  }
});

import Report from '../models/Report.js';

// ... (keep existing code)

// Report an offer
router.post('/:id/report', authMiddleware, async (req, res) => {
  logger.debug(`POST /api/offers/${req.params.id}/report - Reporting offer`);
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      logger.warn(`Offer not found: ${req.params.id}`);
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }
    
    const { reason, description } = req.body;
    
    const report = new Report({
      reportType: 'offer',
      targetId: offer._id,
      reportedBy: req.user.id,
      reason,
      description
    });
    
    await report.save();
    
    logger.info(`Offer ${req.params.id} reported by user ${req.user.id}. Report ID: ${report._id}`);
    
    res.json({ success: true, message: 'Report submitted successfully' });
  } catch (error) {
    logger.error({ err: error }, `Error reporting offer ${req.params.id}`);
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
