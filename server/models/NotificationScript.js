import mongoose from 'mongoose';

const notificationScriptSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  code: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('NotificationScript', notificationScriptSchema);
