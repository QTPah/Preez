const mongoose = require('mongoose');
const Offer = require('../models/Offer');
require('dotenv').config({ path: '../.env' });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const addExampleOffers = async () => {
  try {
    await connectDB();

    const exampleOffers = [
      {
        title: "Introduction to Computer Science Textbook",
        description: "Slightly used textbook for CS101",
        price: 50,
        category: "Books",
        user: mongoose.Types.ObjectId(),
        status: "active"
      },
      {
        title: "Calculus Study Guide",
        description: "Comprehensive study guide for Calculus I and II",
        price: 25,
        category: "Study Materials",
        user: mongoose.Types.ObjectId(),
        status: "active"
      },
      {
        title: "Physics Lab Equipment Set",
        description: "Complete set of equipment for introductory physics lab",
        price: 100,
        category: "Lab Equipment",
        user: mongoose.Types.ObjectId(),
        status: "active"
      }
    ];

    const result = await Offer.insertMany(exampleOffers);
    console.log(`${result.length} example offers added successfully`);
  } catch (error) {
    console.error('Error adding example offers:', error);
  } finally {
    mongoose.disconnect();
  }
};

addExampleOffers();
