import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';

const prisma = new PrismaClient();

export const searchRecommendations = asyncHandler(async (req, res) => {
  const { q, limit = 10 } = req.query;

  if (!q || typeof q !== 'string' || q.trim().length === 0) {
    return res.status(200).json({
      success: true,
      data: {
        restaurants: [],
        products: [],
      },
    });
  }

  const searchTerm = q.trim();
  const limitNum = Math.min(parseInt(limit, 10) || 10, 20);

  try {
    const [restaurants, products] = await Promise.all([
      prisma.restaurant.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm } },
            { type: { contains: searchTerm } },
            { location: { contains: searchTerm } },
          ],
        },
        take: limitNum,
        select: {
          id: true,
          name: true,
          type: true,
          location: true,
          imageUrl: true,
          rating: true,
        },
        orderBy: {
          rating: 'desc',
        },
      }),
      prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm } },
            { description: { contains: searchTerm } },
          ],
        },
        take: limitNum,
        include: {
          restaurant: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: [
          { isFeatured: 'desc' },
          { rate: 'desc' },
        ],
      }),
    ]);

    const productsWithParsedImages = products.map((product) => ({
      ...product,
      images: product.images ? (typeof product.images === 'string' ? JSON.parse(product.images) : product.images) : [],
    }));

    return res.status(200).json({
      success: true,
      data: {
        restaurants,
        products: productsWithParsedImages,
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message,
    });
  }
});

