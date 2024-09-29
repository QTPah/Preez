import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  permissions: {
    createOffer: { type: Boolean, default: true },
    editAnyOffer: { type: Boolean, default: false },
    deleteAnyOffer: { type: Boolean, default: false },
    adminAccess: { type: Boolean, default: false },
    manageUsers: { type: Boolean, default: false },
    manageOffers: { type: Boolean, default: false },
    manageCategories: { type: Boolean, default: false },
    viewReports: { type: Boolean, default: false },
    manageSettings: { type: Boolean, default: false }
  },
  settings: {
    profileVisibility: { type: String, default: 'public' },
    showEmail: { type: Boolean, default: false },
    allowMessaging: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: false },
    offerUpdates: { type: Boolean, default: true },
    marketingEmails: { type: Boolean, default: false }
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
