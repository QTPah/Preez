import express from 'express';
import User from '../models/User.js';
import Offer from '../models/Offer.js';
import Report from '../models/Report.js';
import Message from '../models/Message.js';
import { createLogger } from '../utils/logger.js';

const router = express.Router();
const logger = createLogger('statistics-routes');

router.get('/', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOffers = await Offer.countDocuments();
    const totalReports = await Report.countDocuments();
    const totalMessages = await Message.countDocuments();
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    const newOffersToday = await Offer.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
    const pendingReports = await Report.countDocuments({ status: 'pending' });

    res.json({
      totalUsers,
      totalOffers,
      totalReports,
      totalMessages,
      newUsersToday,
      newOffersToday,
      activeUsers,
      pendingReports
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching statistics');
    res.status(500).json({ error: 'Error fetching statistics' });
  }
});

export default router;
