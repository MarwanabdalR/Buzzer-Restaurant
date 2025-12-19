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

  const imageUrl = req.file?.path || data.image || null;
  if (req.file && !req.file.path) {
    return res.status(400).json({ message: 'Image upload failed' });
  }

  let imagesArray = [];
  if (data.images) {
    if (typeof data.images === 'string') {
      try {
        imagesArray = JSON.parse(data.images);
      } catch {
        imagesArray = [];
      }
    } else if (Array.isArray(data.images)) {
      imagesArray = data.images;
    }
  }
  if (imageUrl && !imagesArray.includes(imageUrl)) {
    imagesArray.unshift(imageUrl);
  }
  if (imagesArray.length === 0 && imageUrl) {
    imagesArray = [imageUrl];
  }

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
      image: imageUrl || imagesArray[0] || null,
      images: JSON.stringify(imagesArray),
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

  const imageUrl = req.file?.path || data.image || existing.image || null;
  if (req.file && !req.file.path) {
    return res.status(400).json({ message: 'Image upload failed' });
  }

  let imagesArray = [];
  const existingImages = existing.images ? (typeof existing.images === 'string' ? JSON.parse(existing.images) : existing.images) : [];
  
  if (data.images !== undefined) {
    if (typeof data.images === 'string') {
      try {
        imagesArray = JSON.parse(data.images);
      } catch {
        imagesArray = existingImages;
      }
    } else if (Array.isArray(data.images)) {
      imagesArray = data.images;
    } else {
      imagesArray = existingImages;
    }
  } else {
    imagesArray = existingImages;
  }

  if (imageUrl && !imagesArray.includes(imageUrl)) {
    imagesArray.unshift(imageUrl);
  }
  if (imagesArray.length === 0 && imageUrl) {
    imagesArray = [imageUrl];
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      name: data.name ?? existing.name,
      description: data.description ?? existing.description,
      price: data.price ?? existing.price,
      originalPrice: data.originalPrice !== undefined ? data.originalPrice : existing.originalPrice,
      discountPercent: data.discountPercent !== undefined ? data.discountPercent : existing.discountPercent,
      image: imageUrl || imagesArray[0] || existing.image,
      images: JSON.stringify(imagesArray),
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

