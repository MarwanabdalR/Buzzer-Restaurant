import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from '../utils/orderValidation.js';

const prisma = new PrismaClient();

const validate = async (schema, payload) =>
  schema.validateAsync(payload, { abortEarly: false });

export const createOrder = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { firebaseUid: req.user.uid },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found. Please register first.',
    });
  }

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

  const productIds = data.items.map(item => item.productId);
  
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    select: {
      id: true,
      price: true,
    },
  });

  if (products.length !== productIds.length) {
    return res.status(400).json({
      success: false,
      message: 'One or more products not found',
    });
  }

  const productMap = new Map(products.map(p => [p.id, p]));

  const orderItems = data.items.map((item) => {
    const product = productMap.get(item.productId);
    if (!product) {
      throw new Error(`Product with id ${item.productId} not found`);
    }
    const price = parseFloat(product.price.toString());
    if (isNaN(price)) {
      throw new Error(`Invalid price for product ${item.productId}`);
    }
    return {
      productId: item.productId,
      quantity: item.quantity,
      price: price,
    };
  });

  const totalPrice = orderItems.reduce(
    (sum, item) => {
      return sum + item.price * item.quantity;
    },
    0
  );

  if (isNaN(totalPrice) || totalPrice <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid total price calculated',
    });
  }

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      totalPrice: totalPrice,
      status: 'PENDING',
      location: data.location || null,
      items: {
        create: orderItems,
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
    },
  });

  return res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: order,
  });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { firebaseUid: req.user.uid },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found. Please register first.',
    });
  }

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
              rate: true,
              restaurant: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
      },
    },
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

export const getOrderById = asyncHandler(async (req, res) => {
  const orderId = Number(req.params.id);
  const user = await prisma.user.findUnique({
    where: { firebaseUid: req.user.uid },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found. Please register first.',
    });
  }

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
              rate: true,
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

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  if (order.userId !== user.id && user.type !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Order retrieved successfully',
    data: order,
  });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { firebaseUid: req.user.uid },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found. Please register first.',
    });
  }

  if (user.type !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }

  const where = {};
  if (req.query.status) {
    const validStatuses = ['PENDING', 'COMPLETED', 'CANCELLED'];
    if (validStatuses.includes(req.query.status.toUpperCase())) {
      where.status = req.query.status.toUpperCase();
    }
  }

  const orders = await prisma.order.findMany({
    where,
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
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return res.status(200).json({
    success: true,
    message: 'All orders retrieved successfully',
    data: orders,
    count: orders.length,
  });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
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

  const isAdmin = user.type === 'admin';
  const isOrderOwner = order.userId === user.id;

  if (!isAdmin && !isOrderOwner) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to update this order',
    });
  }

  if (!isAdmin) {
    if (data.status !== 'CANCELLED') {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own orders. Only admins can complete orders.',
      });
    }

    if (!isOrderOwner) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own orders',
      });
    }
  }

  if (data.status !== 'PENDING' && data.status !== 'COMPLETED' && data.status !== 'CANCELLED') {
    return res.status(400).json({
      success: false,
      message: 'Status can only be changed to PENDING, COMPLETED or CANCELLED',
    });
  }

  if (order.status === 'COMPLETED' || order.status === 'CANCELLED') {
    return res.status(400).json({
      success: false,
      message: `Cannot update order with status: ${order.status}`,
    });
  }

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

  return res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
    data: updatedOrder,
  });
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { firebaseUid: req.user.uid },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found. Please register first.',
    });
  }

  if (user.type !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }

  const orderId = parseInt(req.params.id, 10);
  if (isNaN(orderId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid order ID',
    });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  if (order.status !== 'COMPLETED' && order.status !== 'CANCELLED') {
    return res.status(400).json({
      success: false,
      message: 'Only completed or cancelled orders can be deleted',
    });
  }

  // Delete order items first to avoid foreign key constraint violation
  await prisma.orderItem.deleteMany({
    where: { orderId: orderId },
  });

  // Then delete the order
  await prisma.order.delete({
    where: { id: orderId },
  });

  return res.status(200).json({
    success: true,
    message: 'Order deleted successfully',
  });
});
