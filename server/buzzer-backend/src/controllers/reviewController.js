import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';

const prisma = new PrismaClient();

const reviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().allow('', null).optional(),
});

const validate = async (schema, payload) =>
  schema.validateAsync(payload, { abortEarly: false });

export const createReview = asyncHandler(async (req, res) => {
  const productId = Number(req.params.productId);
  const userId = req.user.id;

  let data;
  try {
    data = await validate(reviewSchema, req.body);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: err.details?.map((d) => d.message) || [err.message],
    });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      productId_userId: {
        productId,
        userId,
      },
    },
  });

  if (existingReview) {
    const updated = await prisma.review.update({
      where: { id: existingReview.id },
      data: {
        rating: data.rating,
        comment: data.comment || null,
      },
    });

    const reviews = await prisma.review.findMany({
      where: { productId },
    });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: { rate: avgRating },
    });

    return res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: updated,
    });
  }

  const review = await prisma.review.create({
    data: {
      rating: data.rating,
      comment: data.comment || null,
      productId,
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          image: true,
        },
      },
    },
  });

  const reviews = await prisma.review.findMany({
    where: { productId },
  });
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await prisma.product.update({
    where: { id: productId },
    data: { rate: avgRating },
  });

  res.status(201).json({
    success: true,
    message: 'Review created successfully',
    data: review,
  });
});

export const getProductReviews = asyncHandler(async (req, res) => {
  const productId = Number(req.params.productId);

  const reviews = await prisma.review.findMany({
    where: { productId },
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
  });

  res.status(200).json({
    success: true,
    data: reviews,
  });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const reviewId = Number(req.params.id);
  const userId = req.user.id;

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found',
    });
  }

  if (review.userId !== userId) {
    return res.status(403).json({
      success: false,
      message: 'You can only delete your own reviews',
    });
  }

  await prisma.review.delete({
    where: { id: reviewId },
  });

  const reviews = await prisma.review.findMany({
    where: { productId: review.productId },
  });

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null;

  await prisma.product.update({
    where: { id: review.productId },
    data: { rate: avgRating },
  });

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
  });
});

