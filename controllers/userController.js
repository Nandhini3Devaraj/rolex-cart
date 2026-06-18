/**
 * User Controller
 * Handles user management operations
 */

import prisma from '../config/db.js';
import { hashPassword } from '../utils/passwordUtils.js';
import { toUserResponse } from '../utils/serialize.js';

/**
 * Get all users
 * GET /api/users
 * Accessible by: Manager, SuperAdmin
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    res.status(200).json({
      success: true,
      data: users.map(toUserResponse),
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID
 * GET /api/users/:id
 */
export const getUserById = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: toUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new user (SuperAdmin only)
 * POST /api/users
 * Body: { name, email, password, role }
 */
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: await hashPassword(password),
        role: role || 'Customer',
      },
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: toUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user by ID
 * PUT /api/users/:id
 * Body: { name, email, role, isActive }
 */
export const updateUser = async (req, res, next) => {
  try {
    const { name, email, role, isActive } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { id: req.params.id },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(email && { email: email.toLowerCase() }),
        ...(role && { role }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: toUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user by ID
 * DELETE /api/users/:id
 * Accessible by: SuperAdmin
 */
export const deleteUser = async (req, res, next) => {
  try {
    const user = await prisma.user.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: toUserResponse(user),
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    next(error);
  }
};

/**
 * Get users by role
 * GET /api/users/role/:role
 */
export const getUsersByRole = async (req, res, next) => {
  try {
    const { role } = req.params;
    const validRoles = ['Customer', 'Staff', 'Manager', 'SuperAdmin'];

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Valid roles: ${validRoles.join(', ')}`,
      });
    }

    const users = await prisma.user.findMany({
      where: { role },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: users.map(toUserResponse),
      count: users.length,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUsersByRole,
};
