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
    const allPermissions = [
      'createOffer',
      'editAnyOffer',
      'deleteAnyOffer',
      'manageUsers',
      'manageOffers',
      'manageCategories',
      'viewReports',
      'manageSettings',
      'adminAccess'
    ];

    const result = await User.updateMany(
      {},
      {
        $set: {
          permissions: allPermissions
        }
      }
    );

    console.log(`Updated ${result.modifiedCount} users with all available permissions`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating user permissions:', error);
    process.exit(1);
  }
};

updateUserPermissions();
