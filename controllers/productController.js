/**
 * Product Controller
 * Handles product management operations
 */

import prisma from '../config/db.js';
import {
  toProductResponse,
  buildProductSearchFilter,
  productInclude,
} from '../utils/serialize.js';

/**
 * Get all products with pagination, filtering, and sorting
 * GET /api/products
 * Query params: page, limit, category, sort, search
 */
export const getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { category, sort = 'createdAt', search } = req.query;

    const where = {};
    if (category) where.category = category;
    if (search) Object.assign(where, buildProductSearchFilter(search));

    let orderBy = { createdAt: 'desc' };
    if (sort === 'price-low') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price-high') {
      orderBy = { price: 'desc' };
    } else if (sort !== 'createdAt') {
      orderBy = { [sort]: 'desc' };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: productInclude,
      }),
      prisma.product.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: products.map(toProductResponse),
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
 * Get product by ID
 * GET /api/products/:id
 */
export const getProductById = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: productInclude,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: toProductResponse(product),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new product
 * POST /api/products
 * Body: { name, description, category, price, stock, image }
 * Accessible by: Manager, SuperAdmin
 */
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, category, price, stock, image } = req.body;

    if (!name || !description || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, category, and price are required',
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        category,
        price: Number(price),
        stock: stock !== undefined ? Number(stock) : 0,
        ...(image && { image }),
      },
      include: productInclude,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: toProductResponse(product),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update product by ID
 * PUT /api/products/:id
 * Body: { name, description, category, price, stock, image }
 * Accessible by: Manager, SuperAdmin
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { name, description, category, price, stock, image } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(category && { category }),
        ...(price !== undefined && { price: Number(price) }),
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(image && { image }),
      },
      include: productInclude,
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: toProductResponse(product),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete product by ID
 * DELETE /api/products/:id
 * Accessible by: SuperAdmin
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await prisma.product.delete({
      where: { id: req.params.id },
      include: productInclude,
    });

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: toProductResponse(product),
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    next(error);
  }
};

/**
 * Search products
 * GET /api/products/search/:query
 */
export const searchProducts = async (req, res, next) => {
  try {
    const { query } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = buildProductSearchFilter(query);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: productInclude,
      }),
      prisma.product.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: products.map(toProductResponse),
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
 * Get products by category
 * GET /api/products/category/:category
 */
export const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = { category };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: productInclude,
      }),
      prisma.product.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: products.map(toProductResponse),
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
 * Add review to product
 * POST /api/products/:id/reviews
 * Body: { rating, comment }
 * Accessible by: All authenticated users
 */
export const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = req.user.id;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Rating and comment are required',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const existingReview = await prisma.productReview.findUnique({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product',
      });
    }

    await prisma.productReview.create({
      data: {
        productId,
        userId,
        userName: user.name,
        rating: Number(rating),
        comment,
      },
    });

    const reviews = await prisma.productReview.findMany({
      where: { productId },
    });

    const averageRating =
      reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        totalReviews: reviews.length,
        averageRating,
      },
      include: productInclude,
    });

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: toProductResponse(updatedProduct),
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory,
  addReview,
};
