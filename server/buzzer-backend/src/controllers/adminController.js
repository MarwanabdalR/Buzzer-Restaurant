import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';

const prisma = new PrismaClient();

export const getDashboardStats = asyncHandler(async (req, res) => {
  try {
    const [
      totalUsers,
      totalRestaurants,
      totalOrders,
      totalCategories,
      totalProducts,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
    ] = await Promise.all([
      prisma.user.count().catch(() => 0),
      (async () => {
        try {
          if (prisma.restaurant && typeof prisma.restaurant.count === 'function') {
            return await prisma.restaurant.count();
          }
          return 0;
        } catch {
          return 0;
        }
      })(),
      prisma.order.count().catch(() => 0),
      prisma.category.count().catch(() => 0),
      prisma.product.count().catch(() => 0),
      prisma.order.count({ where: { status: 'PENDING' } }).catch(() => 0),
      prisma.order.count({ where: { status: 'COMPLETED' } }).catch(() => 0),
      prisma.order.count({ where: { status: 'CANCELLED' } }).catch(() => 0),
      prisma.order.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { totalPrice: true },
      }).catch(() => ({ _sum: { totalPrice: null } })),
    ]);

    const revenue = totalRevenue?._sum?.totalPrice || 0;

    return res.status(200).json({
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data: {
        users: {
          total: totalUsers || 0,
        },
        restaurants: {
          total: totalRestaurants || 0,
        },
        orders: {
          total: totalOrders || 0,
          pending: pendingOrders || 0,
          completed: completedOrders || 0,
          cancelled: cancelledOrders || 0,
        },
        categories: {
          total: totalCategories || 0,
        },
        products: {
          total: totalProducts || 0,
        },
        revenue: {
          total: Number(revenue) || 0,
        },
      },
    });
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard statistics',
      error: error.message,
    });
  }
});

