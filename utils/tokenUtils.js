/**
 * JWT Token Utilities
 * Functions for generating and managing JWT tokens
 */

import jwt from 'jsonwebtoken';

/**
 * Generate JWT token
 * @param {Object} payload - Data to encode in token (e.g., user id, role)
 * @returns {string} JWT token
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token data
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export default { generateToken, verifyToken };
