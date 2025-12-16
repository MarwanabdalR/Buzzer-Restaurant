import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { createOrderSchema, updateOrderStatusSchema } from '../utils/orderValidation.js';

const prisma = new PrismaClient();

const validate = async (schema, payload) =>
  schema.validateAsync(payload, { abortEarly: false });

export const createOrder = asyncHandler(async (req, res) => {
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

  const user = await prisma.user.findUnique({
    where: { firebaseUid: req.user.uid },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found. Please register first.',
    });
  }

  const productIds = data.items.map((item) => item.productId);

  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
    },
  });

  if (products.length !== productIds.length) {
    const foundIds = products.map((p) => p.id);
    const missingIds = productIds.filter((id) => !foundIds.includes(id));
    return res.status(404).json({
      success: false,
      message: 'One or more products not found',
      details: `Products with IDs [${missingIds.join(', ')}] do not exist`,
    });
  }

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

    const itemPrice = Number(product.price);
    const itemTotal = itemPrice * item.quantity;
    totalPrice += itemTotal;

    orderItemsData.push({
      productId: product.id,
      quantity: item.quantity,
      price: itemPrice,
    });
  }

  const order = await prisma.$transaction(async (tx) => {
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

  if (data.status !== 'COMPLETED' && data.status !== 'CANCELLED') {
    return res.status(400).json({
      success: false,
      message: 'Status can only be changed to COMPLETED or CANCELLED',
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
