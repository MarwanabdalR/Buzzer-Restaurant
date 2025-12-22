import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';
import { createRestaurantSchema, updateRestaurantSchema } from '../utils/restaurantValidation.js';

const prisma = new PrismaClient();

const validateRestaurantInput = async (data, schema) => {
  await schema.validateAsync(data, { abortEarly: false, stripUnknown: true });
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

  // Handle latitude/longitude: convert empty strings to null and ensure they're numbers or null
  const latitude = req.body.latitude !== undefined && req.body.latitude !== '' && req.body.latitude !== null
    ? parseFloat(req.body.latitude)
    : null;
  const longitude = req.body.longitude !== undefined && req.body.longitude !== '' && req.body.longitude !== null
    ? parseFloat(req.body.longitude)
    : null;

  const restaurant = await prisma.restaurant.create({
    data: {
      name: req.body.name,
      type: req.body.type,
      location: req.body.location,
      latitude: isNaN(latitude) ? null : latitude,
      longitude: isNaN(longitude) ? null : longitude,
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
  
  // Handle latitude/longitude: convert empty strings to null and ensure they're numbers or null
  if (req.body.latitude !== undefined) {
    const latitude = req.body.latitude !== '' && req.body.latitude !== null
      ? parseFloat(req.body.latitude)
      : null;
    updateData.latitude = isNaN(latitude) ? null : latitude;
  }
  if (req.body.longitude !== undefined) {
    const longitude = req.body.longitude !== '' && req.body.longitude !== null
      ? parseFloat(req.body.longitude)
      : null;
    updateData.longitude = isNaN(longitude) ? null : longitude;
  }
  
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

export const getNearbyRestaurants = asyncHandler(async (req, res) => {
  const { userLat, userLng, radiusKM = 10 } = req.body;

  // Check if coordinates are provided and valid
  const hasValidCoordinates = 
    typeof userLat === 'number' && 
    typeof userLng === 'number' &&
    !isNaN(userLat) && 
    !isNaN(userLng) &&
    userLat >= -90 && 
    userLat <= 90 && 
    userLng >= -180 && 
    userLng <= 180;

  // If coordinates are missing or invalid, return top-rated restaurants
  if (!hasValidCoordinates) {
    try {
      const restaurants = await prisma.restaurant.findMany({
        take: 20,
        orderBy: {
          rating: 'desc',
        },
        select: {
          id: true,
          name: true,
          type: true,
          location: true,
          latitude: true,
          longitude: true,
          rating: true,
          imageUrl: true,
          createdAt: true,
        },
      });

      // Format the results with distance: null
      const formattedRestaurants = restaurants.map((restaurant) => ({
        ...restaurant,
        distance: null,
        rating: restaurant.rating ? parseFloat(restaurant.rating) : 0,
        latitude: restaurant.latitude ? parseFloat(restaurant.latitude) : null,
        longitude: restaurant.longitude ? parseFloat(restaurant.longitude) : null,
      }));

      return res.status(200).json({
        success: true,
        message: 'Top-rated restaurants retrieved successfully',
        data: formattedRestaurants,
      });
    } catch (error) {
      console.error('Error fetching top-rated restaurants:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching restaurants',
        error: error.message,
      });
    }
  }

  // Validate radius if coordinates are valid
  const radius = parseFloat(radiusKM);
  if (isNaN(radius) || radius <= 0) {
    return res.status(400).json({
      success: false,
      message: 'radiusKM must be a positive number',
    });
  }

  // Proceed with Haversine formula for nearby restaurants
  const query = `
    SELECT 
      r.*,
      (
        6371 * acos(
          cos(radians(?)) * 
          cos(radians(r.latitude)) * 
          cos(radians(r.longitude) - radians(?)) + 
          sin(radians(?)) * 
          sin(radians(r.latitude))
        )
      ) AS distance
    FROM Restaurant r
    WHERE r.latitude IS NOT NULL 
      AND r.longitude IS NOT NULL
      AND (
        6371 * acos(
          cos(radians(?)) * 
          cos(radians(r.latitude)) * 
          cos(radians(r.longitude) - radians(?)) + 
          sin(radians(?)) * 
          sin(radians(r.latitude))
        )
      ) <= ?
    ORDER BY distance ASC
    LIMIT 50
  `;

  try {
    const results = await prisma.$queryRawUnsafe(
      query,
      userLat,
      userLng,
      userLat,
      userLat,
      userLng,
      userLat,
      radius
    );

    // Convert BigInt to Number for distance and format the results
    const restaurants = results.map((restaurant) => ({
      ...restaurant,
      distance: restaurant.distance ? parseFloat(restaurant.distance) : null,
      rating: restaurant.rating ? parseFloat(restaurant.rating) : 0,
      latitude: restaurant.latitude ? parseFloat(restaurant.latitude) : null,
      longitude: restaurant.longitude ? parseFloat(restaurant.longitude) : null,
    }));

    return res.status(200).json({
      success: true,
      message: 'Nearby restaurants retrieved successfully',
      data: restaurants,
    });
  } catch (error) {
    console.error('Error fetching nearby restaurants:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching nearby restaurants',
      error: error.message,
    });
  }
});

