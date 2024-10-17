import Notification from '../models/Notification.js';
import User from '../models/User.js';
import logger from './logger.js';

export const createNotification = async (userId, type, title, message) => {
  try {
    const notification = new Notification({
      user: userId,
      type,
      title,
      message
    });
    await notification.save();
    return notification;
  } catch (error) {
    logger.error('Error creating notification:', error);
    throw error;
  }
};

export const getUnreadNotifications = async (userId) => {
  try {
    return await Notification.find({ user: userId, read: false }).sort({ date: -1 });
  } catch (error) {
    logger.error('Error getting unread notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const notification = await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
    return notification;
  } catch (error) {
    logger.error('Error marking notification as read:', error);
    throw error;
  }
};

export const deleteOldReadNotifications = async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  try {
    await Notification.deleteMany({ read: true, date: { $lt: thirtyDaysAgo } });
    logger.info('Old read notifications deleted');
  } catch (error) {
    logger.error('Error deleting old read notifications:', error);
    throw error;
  }
};
