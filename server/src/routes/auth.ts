import express, { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';

const router: Router = express.Router();
