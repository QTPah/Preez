import User from '../models/User.js';
import NotificationPreset from '../models/NotificationPreset.js';
import NotificationScript from '../models/NotificationScript.js';
import logger from './logger.js';
import vm from 'vm';

export const executeNotificationScript = async (scriptId, context) => {
  try {
    const script = await NotificationScript.findById(scriptId);
    if (!script) {
      throw new Error('Notification script not found');
    }

    const sandbox = {
      context,
      notification: {
        title: '',
        message: '',
        redirectLink: ''
      },
      console: {
        log: (...args) => logger.info('Script log:', ...args),
        error: (...args) => logger.error('Script error:', ...args)
      }
    };

    vm.createContext(sandbox);
    vm.runInContext(script.code, sandbox);

    return sandbox.notification;
  } catch (error) {
    logger.error('Error executing notification script:', error);
    throw error;
  }
};

export const sendNotification = async (userId, presetId, context = {}) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      logger.warn(`Attempted to send notification to non-existent user: ${userId}`);
      return;
    }

    const preset = await NotificationPreset.findById(presetId).populate('script');
    if (!preset) {
      logger.warn(`Attempted to send notification with non-existent preset: ${presetId}`);
      return;
    }

    if (user.notificationPreferences.get(preset.name) === false) {
      logger.info(`User ${userId} has disabled notifications for preset: ${preset.name}`);
      return;
    }

    const notification = await executeNotificationScript(preset.script._id, context);

    user.notifications.push({
      preset: preset._id,
      title: notification.title,
      message: notification.message,
      redirectLink: notification.redirectLink
    });

    await user.save();

    logger.info(`Notification sent to user ${userId} using preset ${preset.name}`);
  } catch (error) {
    logger.error('Error sending notification:', error);
    throw error;
  }
};
