/**
 * Authentication Controller
 * Handles user registration, login, and logout
 */

import prisma from '../config/db.js';
import { generateToken } from '../utils/tokenUtils.js';
import { validateEmail, validatePassword, validateRequiredFields } from '../utils/validation.js';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';
import { toUserResponse } from '../utils/serialize.js';

/**
 * Register a new user
 * POST /api/auth/register
 * Body: { name, email, password, role }
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const validation = validateRequiredFields(
      { name, email, password },
      ['name', 'email', 'password']
    );

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validation.errors,
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Password validation failed',
        errors: passwordValidation.errors,
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

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /api/auth/login
 * Body: { email, password }
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : email;

    const validation = validateRequiredFields({ email, password }, ['email', 'password']);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validation.errors,
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'User account is deactivated',
      });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user (client-side token deletion)
 * POST /api/auth/logout
 */
export const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully. Please delete the token on client side.',
    });
  } catch (error) {
    next(error);
  }
};

export default { register, login, logout };
