import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

const updateUserPermissions = async () => {
  try {
    const result = await User.updateMany(
      { permissions: { $exists: false } },
      {
        $set: {
          permissions: {
            createOffer: true,
            editAnyOffer: false,
            deleteAnyOffer: false,
            adminAccess: false,
            manageUsers: false,
            manageOffers: false,
            manageCategories: false,
            viewReports: false,
            manageSettings: false
          }
        }
      }
    );

    console.log(`Updated ${result.modifiedCount} users with default permissions`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating user permissions:', error);
    process.exit(1);
  }
};

updateUserPermissions();
