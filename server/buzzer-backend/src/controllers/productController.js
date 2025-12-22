import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import {
  createProductSchema,
  updateProductSchema,
} from '../utils/productValidation.js';

const prisma = new PrismaClient();

const validate = async (schema, payload) =>
  schema.validateAsync(payload, { abortEarly: false });

export const createProduct = asyncHandler(async (req, res) => {
  let data;
  try {
    data = await validate(createProductSchema, req.body);
  } catch (err) {
    return res.status(400).json({
      message: 'Validation error',
      details: err.details?.map((d) => d.message) || [err.message],
    });
  }

  const categoryId = Number(data.categoryId);
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  // Frontend uploads directly to Cloudinary and sends the URL in data.image
  const imageUrl = data.image || null;
  const imagesArray = imageUrl ? [imageUrl] : [];

  // Auto-calculate discountPercent if originalPrice and price are provided
  let discountPercent = data.discountPercent || null;
  if (data.originalPrice && data.price && parseFloat(data.originalPrice) > parseFloat(data.price)) {
    const original = parseFloat(data.originalPrice);
    const current = parseFloat(data.price);
    discountPercent = Math.round(((original - current) / original) * 100);
  }

  const product = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description || null,
      price: data.price,
      originalPrice: data.originalPrice || null,
      discountPercent: discountPercent,
      image: imageUrl || null,
      images: imagesArray.length > 0 ? JSON.stringify(imagesArray) : null,
      rate: data.rate ?? null,
      isFeatured: data.isFeatured ?? false,
      categoryId,
      restaurantId: data.restaurantId || null,
    },
  });

  res.status(201).json(product);
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const { categoryId, restaurantId } = req.query;
  const where = {};

  if (categoryId !== undefined) {
    const parsed = Number(categoryId);
    if (Number.isNaN(parsed)) {
      return res.status(400).json({ message: 'Invalid categoryId' });
    }
    where.categoryId = parsed;
  }

  if (restaurantId !== undefined) {
    where.restaurantId = restaurantId;
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      restaurant: true,
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { id: 'asc' },
  });

  const productsWithParsedImages = products.map((product) => ({
    ...product,
    images: product.images ? (typeof product.images === 'string' ? JSON.parse(product.images) : product.images) : [],
  }));

  res.status(200).json(productsWithParsedImages);
});

export const getProductById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      restaurant: true,
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  const productWithParsedImages = {
    ...product,
    images: product.images ? (typeof product.images === 'string' ? JSON.parse(product.images) : product.images) : [],
  };
  
  res.status(200).json(productWithParsedImages);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: 'Product not found' });
  }

  let data;
  try {
    data = await validate(updateProductSchema, req.body);
  } catch (err) {
    return res.status(400).json({
      message: 'Validation error',
      details: err.details?.map((d) => d.message) || [err.message],
    });
  }

  let categoryId = existing.categoryId;
  if (data.categoryId !== undefined) {
    categoryId = Number(data.categoryId);
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
  }

  // Frontend uploads directly to Cloudinary and sends the URL in data.image
  const imageUrl = data.image !== undefined ? (data.image || null) : existing.image;
  
  // Store as array for backward compatibility (single item array)
  const imagesArray = imageUrl ? [imageUrl] : [];

  const updated = await prisma.product.update({
    where: { id },
    data: {
      name: data.name ?? existing.name,
      description: data.description ?? existing.description,
      price: data.price ?? existing.price,
      originalPrice: data.originalPrice !== undefined ? data.originalPrice : existing.originalPrice,
      discountPercent: data.discountPercent !== undefined ? data.discountPercent : existing.discountPercent,
      image: imageUrl,
      images: imagesArray.length > 0 ? JSON.stringify(imagesArray) : existing.images,
      rate: data.rate ?? existing.rate,
      isFeatured: data.isFeatured !== undefined ? data.isFeatured : existing.isFeatured,
      categoryId,
      restaurantId: data.restaurantId !== undefined ? data.restaurantId : existing.restaurantId,
    },
  });

  res.status(200).json(updated);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: 'Product not found' });
  }

  try {
    await prisma.product.delete({ where: { id } });
    return res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    if (err.code === 'P2003') {
      return res.status(400).json({
        message: 'Cannot delete product because it is referenced by other records (e.g., order items).',
      });
    }
    throw err;
  }
});

