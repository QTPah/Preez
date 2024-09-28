import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import offerRoutes from './routes/offers.js';
import notificationRoutes from './routes/notifications.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  import('../build/handler.js').then(({ handler }) => {
    app.use(handler);
  }).catch(err => {
    console.error('Failed to import handler:', err);
  });
} else {
  app.use((req, res) => {
    res.status(404).send('Not found');
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${PROD_MODE ? 'production' : 'development'} mode`);
});
