import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import path from 'path';
import authRoutes from './routes/auth.js';
import offerRoutes from './routes/offers.js';
import { handler } from '../build/handler.js';

dotenv.config();

const isProduction = process.argv.includes('--prod');

// Load your SSL certificate and key
const options = {
    key: fs.readFileSync('private-key.pem'),
    cert: fs.readFileSync('certificate.pem'),
};

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const username = encodeURIComponent(process.env.MONGODB_USERNAME);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
const uri = `mongodb://${username}:${password}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/offers', offerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});


const PORT = process.env.PORT || 443;

if(isProduction) {
  app.use(handler);
  https.createServer(options, app).listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
} else {
  app.listen(PORT, () => console.log(`Server running on port ${process.env.PORT}`))
}

