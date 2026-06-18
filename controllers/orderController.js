/**
 * Order Controller
 * Handles order management operations
 */

import prisma from '../config/db.js';
import { toOrderResponse, orderInclude } from '../utils/serialize.js';

/**
 * Get all orders
 * GET /api/orders
 * Accessible by: Staff, Manager, SuperAdmin
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status } = req.query;

    const where = {};
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: orderInclude,
      }),
      prisma.order.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: orders.map(toOrderResponse),
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
 * Get order by ID
 * GET /api/orders/:id
 */
export const getOrderById = async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: orderInclude,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: toOrderResponse(order),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new order
 * POST /api/orders
 * Body: { products: [{ product, quantity }], shippingAddress, notes }
 * Accessible by: Customers
 */
export const createOrder = async (req, res, next) => {
  try {
    const { products, shippingAddress, notes } = req.body;
    const customerId = req.user.id;

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one product is required',
      });
    }

    const orderProducts = [];
    let totalAmount = 0;

    for (const item of products) {
      const product = await prisma.product.findUnique({
        where: { id: item.product },
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.product} not found`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      orderProducts.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });

      totalAmount += product.price * item.quantity;

      await prisma.product.update({
        where: { id: product.id },
        data: { stock: product.stock - item.quantity },
      });
    }

    const order = await prisma.order.create({
      data: {
        customerId,
        totalAmount,
        shippingAddress: shippingAddress || null,
        notes,
        items: {
          create: orderProducts,
        },
      },
      include: orderInclude,
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: toOrderResponse(order),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update order by ID
 * PUT /api/orders/:id
 * Body: { status, shippingAddress, notes }
 * Accessible by: Manager, SuperAdmin
 */
export const updateOrder = async (req, res, next) => {
  try {
    const { status, shippingAddress, notes } = req.body;

    const existingOrder = await prisma.order.findUnique({
      where: { id: req.params.id },
    });

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        ...(status && { status }),
        ...(shippingAddress && { shippingAddress }),
        ...(notes && { notes }),
      },
      include: orderInclude,
    });

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: toOrderResponse(order),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete order by ID
 * DELETE /api/orders/:id
 * Accessible by: SuperAdmin
 */
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }

    await prisma.order.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
      data: toOrderResponse(order),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get orders by customer
 * GET /api/orders/customer/:customerId
 */
export const getOrdersByCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = { customerId };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: orderInclude,
      }),
      prisma.order.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: orders.map(toOrderResponse),
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
 * Get orders by status
 * GET /api/orders/status/:status
 */
export const getOrdersByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    const validStatuses = ['Pending', 'Processing', 'Completed', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid statuses: ${validStatuses.join(', ')}`,
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = { status };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: orderInclude,
      }),
      prisma.order.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: orders.map(toOrderResponse),
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

export default {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrdersByCustomer,
  getOrdersByStatus,
};
