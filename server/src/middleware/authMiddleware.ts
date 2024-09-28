import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
