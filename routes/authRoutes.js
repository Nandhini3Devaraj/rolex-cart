/**
 * Authentication Routes
 * Handles authentication endpoints: register, login, logout
 */

import express from 'express';
import { register, login, logout } from '../controllers/authController.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', login);

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', logout);

export default router;
