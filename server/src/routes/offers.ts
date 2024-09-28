import express, { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import Offer from '../models/Offer';
import Notification from '../models/Notification';
import authMiddleware from '../middleware/authMiddleware';

const router: Router = express.Router();
