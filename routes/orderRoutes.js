/**
 * Order Routes
 * Handles order management endpoints
 */

import express from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrdersByCustomer,
  getOrdersByStatus,
} from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Apply auth middleware to all order routes
router.use(authMiddleware);

/**
 * GET /api/orders
 * Get all orders
 * Accessible by: Staff, Manager, SuperAdmin
 */
router.get('/', roleMiddleware('Staff', 'Manager', 'SuperAdmin'), getAllOrders);

/**
 * GET /api/orders/status/:status
 * Get orders by status
 * Accessible by: Staff, Manager, SuperAdmin
 */
router.get('/status/:status', roleMiddleware('Staff', 'Manager', 'SuperAdmin'), getOrdersByStatus);

/**
 * GET /api/orders/customer/:customerId
 * Get orders by customer
 * Accessible by: Customer (own orders) or Manager/SuperAdmin
 */
router.get('/customer/:customerId', getOrdersByCustomer);

/**
 * GET /api/orders/:id
 * Get order by ID
 */
router.get('/:id', getOrderById);

/**
 * POST /api/orders
 * Create new order
 * Accessible by: Customers
 */
router.post('/', roleMiddleware('Customer', 'Manager', 'SuperAdmin'), createOrder);

/**
 * PUT /api/orders/:id
 * Update order by ID
 * Accessible by: Manager, SuperAdmin
 */
router.put('/:id', roleMiddleware('Manager', 'SuperAdmin'), updateOrder);

/**
 * DELETE /api/orders/:id
 * Delete order by ID
 * Accessible by: SuperAdmin
 */
router.delete('/:id', roleMiddleware('SuperAdmin'), deleteOrder);

export default router;
