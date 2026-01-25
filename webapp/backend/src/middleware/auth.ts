import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createError } from './errorHandler.js';

// Re-export createError for convenience
export { createError } from './errorHandler.js';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function authenticate(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(createError('Authentication required', 401, 'UNAUTHORIZED'));
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return next(createError('Invalid token format', 401, 'INVALID_TOKEN'));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env['JWT_SECRET'] || 'default-secret'
    ) as JwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(createError('Token expired', 401, 'TOKEN_EXPIRED'));
    }
    return next(createError('Invalid token', 401, 'INVALID_TOKEN'));
  }
}

export function authorize(...roles: string[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError('Authentication required', 401, 'UNAUTHORIZED'));
    }

    if (!roles.includes(req.user.role)) {
      return next(createError('Insufficient permissions', 403, 'FORBIDDEN'));
    }

    next();
  };
}
