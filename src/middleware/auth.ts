import { Request, Response, NextFunction } from 'express';

// Extend the Express Request type to include custom properties
declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: string };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
 
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
 
  try {
    // In a real app, verify the JWT token here
    const decoded = { id: 1, role: 'admin' }; // Mock decoded token
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
   
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
   
    next();
  };
};