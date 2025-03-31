import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../helpers/jwt.js';
import { IJwtPayload } from '../interfaces/auth.interfaces.js';

declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}

export const jwtValidator = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      message: 'No token provided',
      status: 401
    });
  }

  try {
    const decoded = await verifyToken(token);
    const { uid, name } = decoded as IJwtPayload;
    req.user = { uid, name };
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid token',
      status: 401
    });
  }
};
