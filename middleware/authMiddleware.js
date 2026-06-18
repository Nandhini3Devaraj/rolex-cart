/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 * Used to protect routes that require authentication
 */

import jwt from 'jsonwebtoken';

/**
 * Middleware to verify JWT token
 * Extracts token from Authorization header
 * Attaches decoded user data to req.user
 */
export const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login first.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;
    next();
  } catch (error) {
    // Handle different JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Token verification failed',
    });
  }
};

export default authMiddleware;
