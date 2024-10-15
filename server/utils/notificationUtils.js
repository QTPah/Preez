import User from '../models/User.js';
import NotificationPreset from '../models/NotificationPreset.js';
import logger from './logger.js';

const replaceTemplateVariables = (text, variables) => {
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return variables[key] !== undefined ? variables[key] : match;
  });
};

export const sendNotification = async (notification) => {
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

  user.notifications.push(notification);
  await user.save();

  logger.info(`notification sent to user ${userId} of type ${type}`);
};
