import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import authMiddleware from '../middleware/authMiddleware.js';
import { createLogger } from '../utils/logger.js';

const router = express.Router();
const logger = createLogger('settings-routes');

const aboutPagePath = path.join(process.cwd(), 'data', 'about.md');

router.get('/about', async (req, res) => {
  try {
    const content = await fs.readFile(aboutPagePath, 'utf-8');
    res.json({ content });
  } catch (error) {
    logger.error({ err: error }, 'Error reading About page content');
    res.status(500).json({ error: 'Error reading About page content' });
  }
});

router.put('/about', authMiddleware, async (req, res) => {
  if (!req.user.permissions.includes('manageSettings')) {
    return res.status(403).json({ error: 'Not authorized to update settings' });
  }

  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  try {
    await fs.writeFile(aboutPagePath, content, 'utf-8');
    res.json({ message: 'About page content updated successfully' });
  } catch (error) {
    logger.error({ err: error }, 'Error updating About page content');
    res.status(500).json({ error: 'Error updating About page content' });
  }
});

export default router;
