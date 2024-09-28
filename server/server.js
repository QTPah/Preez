const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const authRoutes = require('./routes/auth');
const offerRoutes = require('./routes/offers');
const notificationRoutes = require('./routes/notifications');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const PROD_MODE = process.argv.includes('--prod');

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your SvelteKit app's URL
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/notifications', notificationRoutes);

if (PROD_MODE) {
  // Serve static files from the SvelteKit build
  app.use(express.static(path.join(__dirname, '../build')));

  // Handle SvelteKit routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${PROD_MODE ? 'production' : 'development'} mode`);
});
