import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { WebSocketServer } from 'ws';
import authRoutes from './routes/auth.js';
import offerRoutes from './routes/offers.js';
import userRoutes from './routes/users.js';
import notificationRoutes from './routes/notifications.js';
import chatRoutes from './routes/chat.js';
import { handler } from '../build/handler.js';
import logger from './utils/logger.js';
import { deleteOldReadNotifications } from './utils/notificationUtils.js';

dotenv.config();

const isProduction = process.argv.includes('--prod');
logger.info('Is production mode:', isProduction);

// Load your SSL certificate and key
const options = {
    key: fs.readFileSync('private-key.pem'),
    cert: fs.readFileSync('certificate.pem'),
};

const app = express();


// Serve static files 
const directory = path.resolve('uploads');
logger.info('Serving static files from: ' + directory);
app.use('/uploads', express.static(directory));

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
logger.info('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => logger.info('Connected to MongoDB'))
.catch((err) => logger.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Error caught in middleware:', err);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 443;
logger.info('Server port: ' + PORT);

if(isProduction) {
  app.use(handler);
  const server = https.createServer(options, app);
  const wss = new WebSocketServer({ server });
  
  wss.on('connection', (ws) => {
    logger.info('New WebSocket connection');
    ws.on('message', (message) => {
      logger.info('Received:', message);
    });
  });

  server.listen(PORT, '0.0.0.0', () => logger.info(`HTTPS Server running on port ${PORT}`));
} else {
  const server = app.listen(PORT, () => logger.info(`HTTP Server running on port ${PORT}`));
  const wss = new WebSocketServer({ server });
  
  wss.on('connection', (ws) => {
    logger.info('New WebSocket connection');
    ws.on('message', (message) => {
      logger.info('Received:', message);
    });
  });
}

// Schedule deletion of old read notifications
setInterval(deleteOldReadNotifications, 24 * 60 * 60 * 1000); // Run once a day

