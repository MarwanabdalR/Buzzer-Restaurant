import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';
import { createRestaurantSchema, updateRestaurantSchema } from '../utils/restaurantValidation.js';

const prisma = new PrismaClient();

const validateRestaurantInput = async (data, schema) => {
  await schema.validateAsync(data, { abortEarly: false });
};

export const getAllRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await prisma.restaurant.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return res.status(200).json({
    success: true,
    message: 'Restaurants retrieved successfully',
    data: restaurants,
  });
});

export const getRestaurantById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
  });

  if (!restaurant) {
    return res.status(404).json({
      success: false,
      message: 'Restaurant not found',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Restaurant retrieved successfully',
    data: restaurant,
  });
});

export const createRestaurant = asyncHandler(async (req, res) => {
  try {
    await validateRestaurantInput(req.body, createRestaurantSchema);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: err.details?.map((d) => d.message) || [err.message],
    });
  }

  const restaurant = await prisma.restaurant.create({
    data: {
      name: req.body.name,
      type: req.body.type,
      location: req.body.location,
      rating: req.body.rating || 0,
      imageUrl: req.body.imageUrl || null,
    },
  });

  return res.status(201).json({
    success: true,
    message: 'Restaurant created successfully',
    data: restaurant,
  });
});

export const updateRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.restaurant.findUnique({
    where: { id },
  });

  if (!existing) {
    return res.status(404).json({
      success: false,
      message: 'Restaurant not found',
    });
  }

  try {
    await validateRestaurantInput(req.body, updateRestaurantSchema);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: err.details?.map((d) => d.message) || [err.message],
    });
  }

  const updateData = {};
  if (req.body.name !== undefined) updateData.name = req.body.name;
  if (req.body.type !== undefined) updateData.type = req.body.type;
  if (req.body.location !== undefined) updateData.location = req.body.location;
  if (req.body.rating !== undefined) updateData.rating = req.body.rating;
  if (req.body.imageUrl !== undefined) updateData.imageUrl = req.body.imageUrl || null;

  const updated = await prisma.restaurant.update({
    where: { id },
    data: updateData,
  });

  return res.status(200).json({
    success: true,
    message: 'Restaurant updated successfully',
    data: updated,
  });
});

export const deleteRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.restaurant.findUnique({
    where: { id },
  });

  if (!existing) {
    return res.status(404).json({
      success: false,
      message: 'Restaurant not found',
    });
  }

  await prisma.restaurant.delete({
    where: { id },
  });

  return res.status(200).json({
    success: true,
    message: 'Restaurant deleted successfully',
  });
});

