import User from '../models/User.js';
import NotificationPreset from '../models/NotificationPreset.js';
import logger from './logger.js';

const replaceTemplateVariables = (text, variables) => {
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return variables[key] !== undefined ? variables[key] : match;
  });
};

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

    const templateVariables = {
      username: user.username,
      email: user.email,
      userId: user._id.toString(),
      currentDate: new Date().toLocaleDateString(),
      currentTime: new Date().toLocaleTimeString(),
      ...customData
    };

    const notification = {
      type,
      title: replaceTemplateVariables(preset.title, templateVariables),
      message: replaceTemplateVariables(preset.message, templateVariables),
      redirectLink: replaceTemplateVariables(preset.redirectLink, templateVariables),
      ...customData
    };

    user.notifications.push(notification);
    await user.save();

    logger.info(`Notification sent to user ${userId} of type ${type}`);
  } catch (error) {
    logger.error('Error sending notification:', error);
  }
};
