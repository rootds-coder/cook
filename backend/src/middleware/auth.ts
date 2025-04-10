import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import ApiError from '../utils/ApiError';
import Admin from '../models/Admin';
import { asyncHandler } from 'express-async-handler';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        id: string;
        role: string;
      };
    }
  }
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    id: string;
    role: string;
  };
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
  id: string;
  role: string;
}

export interface RequestWithUser extends Request {
  user?: AuthenticatedUser;
}

export const protect = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError('Not authorized, no token', 401));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as jwt.JwtPayload & { id: string; role: string; email: string };

    req.user = {
      id: decoded.id,
      userId: decoded.id,
      role: decoded.role,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error('Auth Error:', error);
    return next(new ApiError('Not authorized, token failed', 401));
  }
});

export const authorize = (...roles: string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ApiError(`User role ${req.user?.role} is not authorized to access this route`, 403)
      );
    }
    next();
  };
};

export const authenticateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

interface JwtPayload {
  id: string;
  role: string;
  email?: string;
} 