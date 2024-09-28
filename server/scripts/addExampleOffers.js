const mongoose = require('mongoose');
const Offer = require('../models/Offer');

const MONGODB_URI = 'mongodb://localhost:27017/preez';    

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
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
        description: "Slightly used textbook for CS101. Great condition, all pages intact.",
        price: 50,
        category: "Books",
        user: mongoose.Types.ObjectId(),
        status: "active",
        tags: ["Computer Science", "Textbook", "CS101"],
        id: mongoose.Types.ObjectId()
      },
      {
        title: "Calculus Study Guide",
        description: "Comprehensive study guide for Calculus I and II. Includes practice problems and solutions.",
        price: 25,
        category: "Study Materials",
        user: mongoose.Types.ObjectId(),
        status: "active",
        tags: ["Mathematics", "Calculus", "Study Guide"],
        id: mongoose.Types.ObjectId()
      },
      {
        title: "Physics Lab Equipment Set",
        description: "Complete set of equipment for introductory physics lab. Includes pendulum, springs, and more.",
        price: 100,
        category: "Lab Equipment",
        user: mongoose.Types.ObjectId(),
        status: "active",
        tags: ["Physics", "Lab Equipment", "Science"],
        id: mongoose.Types.ObjectId()
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

const removeExampleOffers = async () => {
  try {
    await connectDB();

    const result = await Offer.deleteMany({
      title: {
        $in: [
          "Introduction to Computer Science Textbook",
          "Calculus Study Guide",
          "Physics Lab Equipment Set"
        ]
      }
    });

    console.log(`${result.deletedCount} example offers removed successfully`);
  } catch (error) {
    console.error('Error removing example offers:', error);
  } finally {
    mongoose.disconnect();
  }
};

// Uncomment the function you want to run
addExampleOffers();
//removeExampleOffers();
