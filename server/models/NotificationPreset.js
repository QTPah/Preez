import mongoose from 'mongoose';

const notificationPresetSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  defaultEnabled: { type: Boolean, default: true },
  redirectLink: { type: String },
  availableVariables: [{ type: String }]
});

notificationPresetSchema.pre('save', function(next) {
  if (!this.availableVariables || this.availableVariables.length === 0) {
    this.availableVariables = [
      'username',
      'email',
      'userId',
      'currentDate',
      'currentTime'
    ];
  }
  next();
});

export default mongoose.model('NotificationPreset', notificationPresetSchema);
