import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { createOrderSchema, updateOrderStatusSchema } from '../utils/orderValidation.js';

const prisma = new PrismaClient();

/**
 * Validation helper function
 * @param {Joi.Schema} schema - Joi validation schema
 * @param {Object} payload - Data to validate
 * @returns {Promise<Object>} Validated data
 */
const validate = async (schema, payload) =>
  schema.validateAsync(payload, { abortEarly: false });

/**
 * Create Order Controller
 * POST /api/orders
 * 
 * Flow:
 * 1. Validate request body (items array, optional location)
 * 2. Get user from database using req.user.uid (firebaseUid)
 * 3. Extract productIds from items
 * 4. Fetch all products from DB to get actual prices (security)
 * 5. Validate all products exist
 * 6. Calculate totalPrice based on DB prices * quantity
 * 7. Use Prisma transaction to create Order and OrderItems atomically
 * 8. Return created order with items and product details
 * 
 * @param {Object} req - Express request object (req.user.uid available from authMiddleware)
 * @param {Object} res - Express response object
 */
export const createOrder = asyncHandler(async (req, res) => {
  // Step 1: Validate request body
  let data;
  try {
    data = await validate(createOrderSchema, req.body);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: err.details?.map((d) => d.message) || [err.message],
    });
  }

  // Step 2: Get user from database using Firebase UID
  const user = await prisma.user.findUnique({
    where: { firebaseUid: req.user.uid },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found. Please register first.',
    });
  }

  // Step 3: Extract productIds from items
  const productIds = data.items.map((item) => item.productId);

  // Step 4: Fetch all products from DB to get actual prices (SECURITY: Never trust frontend prices)
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
    },
  });

  // Step 5: Validate all products exist
  if (products.length !== productIds.length) {
    const foundIds = products.map((p) => p.id);
    const missingIds = productIds.filter((id) => !foundIds.includes(id));
    return res.status(404).json({
      success: false,
      message: 'One or more products not found',
      details: `Products with IDs [${missingIds.join(', ')}] do not exist`,
    });
  }

  // Step 6: Calculate totalPrice based on DB prices * quantity
  // Create a map for quick lookup
  const productMap = new Map(products.map((p) => [p.id, p]));

  let totalPrice = 0;
  const orderItemsData = [];

  for (const item of data.items) {
    const product = productMap.get(item.productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${item.productId} not found`,
      });
    }

    // Calculate item total using DB price (never trust frontend)
    const itemPrice = Number(product.price);
    const itemTotal = itemPrice * item.quantity;
    totalPrice += itemTotal;

    orderItemsData.push({
      productId: product.id,
      quantity: item.quantity,
      price: itemPrice, // Store the actual DB price
    });
  }

  // Step 7: Use Prisma transaction to ensure data integrity
  const order = await prisma.$transaction(async (tx) => {
    // Create the Order record
    const newOrder = await tx.order.create({
      data: {
        userId: user.id,
        totalPrice: totalPrice.toFixed(2),
        status: 'PENDING',
        location: data.location || null,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            mobileNumber: true,
          },
        },
      },
    });

    return newOrder;
  });

  // Step 8: Return success response
  return res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: order,
  });
});

/**
 * Get My Orders Controller
 * GET /api/orders
 * 
 * Flow:
 * 1. Get user from database using req.user.uid (firebaseUid)
 * 2. Fetch all orders for the user
 * 3. Include items and product details (name, image) for frontend display
 * 4. Sort by createdAt descending (newest first)
 * 
 * @param {Object} req - Express request object (req.user.uid available from authMiddleware)
 * @param {Object} res - Express response object
 */
export const getMyOrders = asyncHandler(async (req, res) => {
  // Step 1: Get user from database
  const user = await prisma.user.findUnique({
    where: { firebaseUid: req.user.uid },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found. Please register first.',
    });
  }

  // Step 2 & 3: Fetch orders with items and product details
  const orders = await prisma.order.findMany({
    where: {
      userId: user.id,
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              image: true,
              price: true,
            },
          },
        },
      },
    },
    // Step 4: Sort by createdAt descending (newest first)
    orderBy: {
      createdAt: 'desc',
    },
  });

  return res.status(200).json({
    success: true,
    message: 'Orders retrieved successfully',
    data: orders,
    count: orders.length,
  });
});

/**
 * Update Order Status Controller
 * PATCH /api/orders/:id
 * 
 * Flow:
 * 1. Validate request body (status)
 * 2. Get user from database (for authorization check)
 * 3. Find order by ID
 * 4. Verify order belongs to user (or user is admin - can be extended)
 * 5. Validate status transition (only allow COMPLETED or CANCELLED)
 * 6. Update order status
 * 7. Return updated order
 * 
 * Note: Currently allows users to update their own orders.
 * For admin-only access, add role check in authMiddleware.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  // Step 1: Validate request body
  let data;
  try {
    data = await validate(updateOrderStatusSchema, req.body);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: err.details?.map((d) => d.message) || [err.message],
    });
  }

  // Step 2: Get user from database
  const user = await prisma.user.findUnique({
    where: { firebaseUid: req.user.uid },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found. Please register first.',
    });
  }

  const orderId = parseInt(req.params.id, 10);
  if (isNaN(orderId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid order ID',
    });
  }

  // Step 3: Find order by ID
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              image: true,
              price: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  // Step 4: Role-based authorization and permission checks
  const isAdmin = user.type === 'admin';
  const isOrderOwner = order.userId === user.id;

  // Check if user has permission to update this order
  if (!isAdmin && !isOrderOwner) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to update this order',
    });
  }

  // Step 5: Role-based status update validation
  // Admin can update to any status (COMPLETED or CANCELLED)
  // User can only cancel their own orders
  if (!isAdmin) {
    // Regular users can only cancel their own orders
    if (data.status !== 'CANCELLED') {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own orders. Only admins can complete orders.',
      });
    }

    // Users can only cancel their own orders
    if (!isOrderOwner) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own orders',
      });
    }
  }

  // Step 6: Validate status transition (for both admin and user)
  // Only allow changing to COMPLETED or CANCELLED
  if (data.status !== 'COMPLETED' && data.status !== 'CANCELLED') {
    return res.status(400).json({
      success: false,
      message: 'Status can only be changed to COMPLETED or CANCELLED',
    });
  }

  // Prevent updating already completed or cancelled orders
  if (order.status === 'COMPLETED' || order.status === 'CANCELLED') {
    return res.status(400).json({
      success: false,
      message: `Cannot update order with status: ${order.status}`,
    });
  }

  // Step 7: Update order status
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: data.status,
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              image: true,
              price: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          fullName: true,
          mobileNumber: true,
        },
      },
    },
  });

  // Step 8: Return success response
  return res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
    data: updatedOrder,
  });
});

