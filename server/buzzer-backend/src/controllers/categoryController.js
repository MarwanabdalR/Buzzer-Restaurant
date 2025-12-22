import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { categorySchema } from '../utils/validationSchemas.js';

const prisma = new PrismaClient();

const validateCategoryInput = async (data) => {
  await categorySchema.validateAsync(data, { abortEarly: false });
};

export const getAllCategories = asyncHandler(async (_req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { id: 'asc' }
  });
  res.status(200).json(categories);
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  res.status(200).json(category);
});

export const createCategory = asyncHandler(async (req, res) => {
  try {
    await validateCategoryInput(req.body);
  } catch (err) {
    return res.status(400).json({
      message: 'Validation error',
      details: err.details?.map((d) => d.message) || [err.message],
    });
  }

  const imageUrl = req.file?.path || req.body.image || null;

  const created = await prisma.category.create({
    data: {
      name: req.body.name,
      image: imageUrl,
    },
  });
  res.status(201).json(created);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: 'Category not found' });
  }

  try {
    await validateCategoryInput(req.body);
  } catch (err) {
    return res.status(400).json({
      message: 'Validation error',
      details: err.details?.map((d) => d.message) || [err.message]
    });
  }

  const imageUrl = req.file?.path || req.body.image || existing.image || null;

  const updated = await prisma.category.update({
    where: { id },
    data: {
      name: req.body.name,
      image: imageUrl
    }
  });
  res.status(200).json(updated);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: 'Category not found' });
  }

  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return res.status(400).json({
      message: 'Cannot delete category with existing products. Remove or reassign products first.',
    });
  }

  await prisma.category.delete({ where: { id } });
  res.status(200).json({ message: 'Category deleted' });
});

