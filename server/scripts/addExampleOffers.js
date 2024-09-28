import mongoose from 'mongoose';
import Offer from '../models/Offer';

const MONGODB_URI = 'mongodb://localhost:27017/preez';    

const connectDB = async (): Promise<void> => {
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
      },
      {
        title: "Biology Microscope",
        description: "High-quality microscope for biology labs. 40x-1000x magnification.",
        price: 150,
        category: "Lab Equipment",
        user: mongoose.Types.ObjectId(),
        status: "active",
        tags: ["Biology", "Microscope", "Lab Equipment"],
        id: mongoose.Types.ObjectId()
      },
      {
        title: "Chemistry Molecular Model Kit",
        description: "Comprehensive molecular model kit for organic and inorganic chemistry.",
        price: 35,
        category: "Study Materials",
        user: mongoose.Types.ObjectId(),
        status: "active",
        tags: ["Chemistry", "Molecular Models", "Study Aid"],
        id: mongoose.Types.ObjectId()
      },
      {
        title: "Engineering Drawing Tools Set",
        description: "Complete set of drawing tools for engineering students. Includes compass, rulers, and protractors.",
        price: 45,
        category: "Tools",
        user: mongoose.Types.ObjectId(),
        status: "active",
        tags: ["Engineering", "Drawing Tools", "Drafting"],
        id: mongoose.Types.ObjectId()
      },
      {
        title: "Statistics Textbook",
        description: "Latest edition of 'Introduction to Statistics' by John Smith. Excellent condition.",
        price: 60,
        category: "Books",
        user: mongoose.Types.ObjectId(),
        status: "active",
        tags: ["Statistics", "Textbook", "Mathematics"],
        id: mongoose.Types.ObjectId()
      },
      {
        title: "Programming Language Flashcards",
        description: "Set of 200 flashcards covering Python, Java, and C++ syntax and concepts.",
        price: 15,
        category: "Study Materials",
        user: mongoose.Types.ObjectId(),
        status: "active",
        tags: ["Programming", "Flashcards", "Computer Science"],
        id: mongoose.Types.ObjectId()
      },
      {
        title: "Graphing Calculator",
        description: "TI-84 Plus graphing calculator. Lightly used, perfect for advanced math courses.",
        price: 75,
        category: "Electronics",
        user: mongoose.Types.ObjectId(),
        status: "active",
        tags: ["Calculator", "Mathematics", "Electronics"],
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
