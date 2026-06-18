/**
 * Product Routes
 * Handles product management endpoints
 */

import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory,
  addReview,
} from '../controllers/productController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

/**
 * GET /api/products
 * Get all products (paginated)
 * Accessible by: All users
 */
router.get('/', getAllProducts);

/**
 * GET /api/products/search/:query
 * Search products
 * Accessible by: All users
 */
router.get('/search/:query', searchProducts);

/**
 * GET /api/products/category/:category
 * Get products by category
 * Accessible by: All users
 */
router.get('/category/:category', getProductsByCategory);

/**
 * GET /api/products/:id
 * Get product by ID
 * Accessible by: All users
 */
router.get('/:id', getProductById);

/**
 * POST /api/products
 * Create new product
 * Accessible by: Manager, SuperAdmin
 */
router.post('/', authMiddleware, roleMiddleware('Manager', 'SuperAdmin'), createProduct);

/**
 * PUT /api/products/:id
 * Update product by ID
 * Accessible by: Manager, SuperAdmin
 */
router.put('/:id', authMiddleware, roleMiddleware('Manager', 'SuperAdmin'), updateProduct);

/**
 * DELETE /api/products/:id
 * Delete product by ID
 * Accessible by: SuperAdmin
 */
router.delete('/:id', authMiddleware, roleMiddleware('SuperAdmin'), deleteProduct);

/**
 * POST /api/products/:id/reviews
 * Add review to product
 * Accessible by: All authenticated users
 */
router.post('/:id/reviews', authMiddleware, addReview);

export default router;
