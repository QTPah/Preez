import User from '../models/User.js';
import NotificationPreset from '../models/NotificationPreset.js';
import logger from './logger.js';

export const sendNotification = async (userId, type, customData = {}) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      logger.warn(`Attempted to send notification to non-existent user: ${userId}`);
      return;
    }

    const preset = await NotificationPreset.findOne({ type });
    if (!preset) {
      logger.warn(`Attempted to send notification with non-existent preset type: ${type}`);
      return;
    }

    if (user.notificationPreferences.get(type) === false) {
      logger.info(`User ${userId} has disabled notifications for type: ${type}`);
      return;
    }

    const notification = {
      type,
      title: preset.title,
      message: preset.message,
      ...customData
    };

    user.notifications.push(notification);
    await user.save();

    logger.info(`Notification sent to user ${userId} of type ${type}`);
  } catch (error) {
    logger.error('Error sending notification:', error);
  }
};
