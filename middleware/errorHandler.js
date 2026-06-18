/**
 * Error Handling Middleware
 * Centralizes error handling for the application
 */

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Prisma unique constraint violation
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field';
    err.statusCode = 400;
    err.message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    err.statusCode = 404;
    err.message = err.message || 'Record not found';
  }

  // Prisma invalid ID / record lookup
  if (err.code === 'P2023') {
    err.statusCode = 400;
    err.message = 'Invalid ID format';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    err.statusCode = 400;
    err.message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    err.statusCode = 401;
    err.message = 'Token expired';
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

export default errorHandler;
