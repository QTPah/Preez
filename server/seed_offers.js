import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Offer from './models/Offer.js';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

const sampleOffers = [
  {
    title: "Calculus Textbook",
    description: "Slightly used calculus textbook, perfect for first-year students.",
    price: 45.99,
    category: "Textbooks",
    tags: ["Math", "Calculus", "Textbook"]
  },
  {
    title: "Chemistry Lab Kit",
    description: "Complete chemistry lab kit for home experiments. Includes glassware and basic chemicals.",
    price: 79.99,
    category: "Lab Equipment",
    tags: ["Chemistry", "Lab", "Equipment"]
  },
  {
    title: "Spanish Language Learning Set",
    description: "Comprehensive Spanish language learning set with textbooks, workbooks, and audio CDs.",
    price: 34.50,
    category: "Language Learning",
    tags: ["Spanish", "Language", "Learning"]
  },
  {
    title: "Graphing Calculator",
    description: "TI-84 Plus graphing calculator, essential for advanced math and science courses.",
    price: 89.99,
    category: "Electronics",
    tags: ["Calculator", "Math", "Science"]
  },
  {
    title: "Art History Flashcards",
    description: "Set of 200 art history flashcards covering major movements and artists.",
    price: 15.99,
    category: "Study Aids",
    tags: ["Art", "History", "Flashcards"]
  },
  {
    title: "Biology Microscope",
    description: "High-quality microscope suitable for biology students. 40x-1000x magnification.",
    price: 129.99,
    category: "Lab Equipment",
    tags: ["Biology", "Microscope", "Lab"]
  },
  {
    title: "World Literature Anthology",
    description: "Comprehensive anthology of world literature from ancient to modern times.",
    price: 55.00,
    category: "Textbooks",
    tags: ["Literature", "Anthology", "World"]
  },
  {
    title: "Acoustic Guitar",
    description: "Beginner-friendly acoustic guitar, perfect for music students.",
    price: 149.99,
    category: "Musical Instruments",
    tags: ["Music", "Guitar", "Instrument"]
  },
  {
    title: "Psychology Research Methods Guide",
    description: "Comprehensive guide to research methods in psychology.",
    price: 28.50,
    category: "Study Aids",
    tags: ["Psychology", "Research", "Methods"]
  },
  {
    title: "Laptop Stand",
    description: "Ergonomic laptop stand for comfortable studying and typing.",
    price: 24.99,
    category: "Accessories",
    tags: ["Laptop", "Ergonomic", "Accessory"]
  },
  {
    title: "Physics Problem Solver",
    description: "Step-by-step solutions to common physics problems for all levels.",
    price: 19.99,
    category: "Study Aids",
    tags: ["Physics", "Problem Solving", "Study"]
  },
  {
    title: "Digital Drawing Tablet",
    description: "Drawing tablet for digital art and design students.",
    price: 79.99,
    category: "Electronics",
    tags: ["Art", "Digital", "Drawing"]
  },
  {
    title: "French Language Dictionary",
    description: "Comprehensive French-English dictionary for language learners.",
    price: 22.50,
    category: "Language Learning",
    tags: ["French", "Dictionary", "Language"]
  },
  {
    title: "Anatomy Model Set",
    description: "Detailed human anatomy model set for medical and biology students.",
    price: 89.99,
    category: "Lab Equipment",
    tags: ["Anatomy", "Biology", "Model"]
  },
  {
    title: "Computer Science Algorithms Book",
    description: "In-depth guide to computer science algorithms and data structures.",
    price: 49.99,
    category: "Textbooks",
    tags: ["Computer Science", "Algorithms", "Programming"]
  },
  {
    title: "Portable Whiteboard",
    description: "Small portable whiteboard for group study sessions and brainstorming.",
    price: 18.99,
    category: "Study Aids",
    tags: ["Whiteboard", "Study", "Portable"]
  },
  {
    title: "Scientific Calculator",
    description: "Advanced scientific calculator for complex mathematical calculations.",
    price: 29.99,
    category: "Electronics",
    tags: ["Calculator", "Science", "Math"]
  },
  {
    title: "Art Supply Set",
    description: "Complete art supply set including pencils, paints, and brushes.",
    price: 39.99,
    category: "Art Supplies",
    tags: ["Art", "Supplies", "Drawing"]
  }
];

const seedOffers = async () => {
  try {
    // Clear existing offers
    await Offer.deleteMany({});

    // Find a user to associate with the offers
    const user = await User.findOne();

    if (!user) {
      console.log('No user found. Please create a user first.');
      process.exit(1);
    }

    // Create offers with the user as the seller
    const offers = sampleOffers.map(offer => ({
      ...offer,
      seller: user._id
    }));

    await Offer.insertMany(offers);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedOffers();
