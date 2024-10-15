import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const notificationSchema = new mongoose.Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  permissions: [{ type: String }],
  settings: {
    profileVisibility: { type: String, default: 'public' },
    showEmail: { type: Boolean, default: false },
    allowMessaging: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: false },
    offerUpdates: { type: Boolean, default: true },
    marketingEmails: { type: Boolean, default: false },
    darkMode: { type: Boolean, default: false }
  },
  notifications: [notificationSchema],
  notificationPreferences: {
    type: Map,
    of: Boolean,
    default: {}
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
