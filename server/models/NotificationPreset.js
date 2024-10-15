import mongoose from 'mongoose';

const notificationPresetSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  defaultEnabled: { type: Boolean, default: true }
});

export default mongoose.model('NotificationPreset', notificationPresetSchema);
