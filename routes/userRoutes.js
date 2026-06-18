/**
 * User Routes
 * Handles user management endpoints
 */

import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUsersByRole,
} from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Apply auth middleware to all user routes
router.use(authMiddleware);

/**
 * GET /api/users
 * Get all users (paginated)
 * Accessible by: SuperAdmin only
 */
router.get('/', roleMiddleware('SuperAdmin'), getAllUsers);

/**
 * GET /api/users/role/:role
 * Get users by role
 * Accessible by: SuperAdmin only
 * NOTE: Must be defined before /:id to avoid route conflict
 */
router.get('/role/:role', roleMiddleware('SuperAdmin'), getUsersByRole);

/**
 * GET /api/users/:id
 * Get user by ID
 * Accessible by: Authenticated users (can view own profile)
 */
router.get('/:id', getUserById);

/**
 * POST /api/users
 * Create new user
 * Accessible by: SuperAdmin
 */
router.post('/', roleMiddleware('SuperAdmin'), createUser);

/**
 * PUT /api/users/:id
 * Update user by ID
 * Accessible by: SuperAdmin
 */
router.put('/:id', roleMiddleware('SuperAdmin'), updateUser);

/**
 * DELETE /api/users/:id
 * Delete user by ID
 * Accessible by: SuperAdmin
 */
router.delete('/:id', roleMiddleware('SuperAdmin'), deleteUser);

export default router;
