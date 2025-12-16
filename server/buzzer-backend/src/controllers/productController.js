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

  const product = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description || null,
      price: data.price,
      image: imageUrl,
      rate: data.rate ?? null,
      categoryId,
    },
  });

  res.status(201).json(product);
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const { categoryId } = req.query;
  const where = {};

  if (categoryId !== undefined) {
    const parsed = Number(categoryId);
    if (Number.isNaN(parsed)) {
      return res.status(400).json({ message: 'Invalid categoryId' });
    }
    where.categoryId = parsed;
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { id: 'asc' },
  });

  res.status(200).json(products);
});

export const getProductById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.status(200).json(product);
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

  const updated = await prisma.product.update({
    where: { id },
    data: {
      name: data.name ?? existing.name,
      description: data.description ?? existing.description,
      price: data.price ?? existing.price,
      image: imageUrl,
      rate: data.rate ?? existing.rate,
      categoryId,
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
    // Handle FK constraints (e.g., order items referencing this product)
    if (err.code === 'P2003') {
      return res.status(400).json({
        message: 'Cannot delete product because it is referenced by other records (e.g., order items).',
      });
    }
    throw err;
  }
});

