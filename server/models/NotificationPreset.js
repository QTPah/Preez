import mongoose from 'mongoose';

const notificationPresetSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  script: { type: mongoose.Schema.Types.ObjectId, ref: 'NotificationScript', required: true },
  defaultEnabled: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('NotificationPreset', notificationPresetSchema);
