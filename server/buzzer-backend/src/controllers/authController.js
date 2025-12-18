import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import admin from '../config/firebase.js';
import { registerSchema, loginSchema, updateProfileSchema } from '../utils/authValidation.js';

const prisma = new PrismaClient();

const validate = async (schema, payload) =>
  schema.validateAsync(payload, { abortEarly: false });

export const register = asyncHandler(async (req, res) => {
  let data;
  try {
    data = await validate(registerSchema, req.body);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: err.details?.map((d) => d.message) || [err.message],
    });
  }

  let decoded;
  try {
    decoded = await admin.auth().verifyIdToken(data.idToken);
  } catch (err) {
    if (err.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        message: 'ID token has expired. Please sign in again.',
      });
    }
    if (err.code === 'auth/argument-error') {
      return res.status(401).json({
        success: false,
        message: 'Invalid ID token format.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired ID token. Please sign in again.',
    });
  }

  const firebaseUid = decoded.uid;

  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { firebaseUid },
        { mobileNumber: data.mobileNumber },
      ],
    },
  });

  if (existing) {
    return res.status(409).json({
      success: false,
      message: 'User already exists, please login',
    });
  }

  const user = await prisma.user.create({
    data: {
      fullName: data.fullName,
      mobileNumber: data.mobileNumber,
      firebaseUid,
      email: null,
      password: null,
      image: null,
      type: 'user',
    },
  });

  return res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: user,
  });
});

export const login = asyncHandler(async (req, res) => {
  let data;
  try {
    data = await validate(loginSchema, req.body);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: err.details?.map((d) => d.message) || [err.message],
    });
  }

  let decoded;
  try {
    decoded = await admin.auth().verifyIdToken(data.idToken);
  } catch (err) {
    if (err.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        message: 'ID token has expired. Please sign in again.',
      });
    }
    if (err.code === 'auth/argument-error') {
      return res.status(401).json({
        success: false,
        message: 'Invalid ID token format.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired ID token. Please sign in again.',
    });
  }

  const firebaseUid = decoded.uid;
  const phoneNumber = decoded.phone_number; // Phone number from Firebase token

  // Try to find user by firebaseUid first
  let user = await prisma.user.findUnique({
    where: { firebaseUid },
  });

  // If not found by firebaseUid, try to find by phone number
  if (!user && phoneNumber) {
    user = await prisma.user.findUnique({
      where: { mobileNumber: phoneNumber },
    });

    // If found by phone number but firebaseUid doesn't match, update it
    if (user && user.firebaseUid !== firebaseUid) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { firebaseUid },
      });
    }
  }

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found. Please register.',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Login successful',
    data: user,
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  // User is already loaded by authenticateAndLoadUser middleware
  // But we need to return the user data in the expected format
  const user = await prisma.user.findUnique({
    where: { firebaseUid: req.user.uid },
    select: {
      id: true,
      fullName: true,
      mobileNumber: true,
      email: true,
      image: true,
      type: true,
      firebaseUid: true,
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found. Please register first.',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully',
    data: user,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  let data;
  try {
    data = await validate(updateProfileSchema, req.body);
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

  if (data.mobileNumber && data.mobileNumber !== user.mobileNumber) {
    const existingMobile = await prisma.user.findUnique({
      where: { mobileNumber: data.mobileNumber },
    });
    if (existingMobile) {
      return res.status(409).json({
        success: false,
        message: 'Mobile number already in use by another account',
      });
    }
  }

  if (data.email !== undefined) {
    const emailValue = data.email || null;
    if (emailValue && emailValue !== user.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: emailValue },
      });
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: 'Email already in use by another account',
        });
      }
    }
  }

  if (data.type !== undefined && data.type !== user.type) {
    return res.status(403).json({
      success: false,
      message: 'You cannot change your user type. Please contact an administrator.',
    });
  }

  const updateData = {};
  if (data.fullName !== undefined) updateData.fullName = data.fullName;
  if (data.email !== undefined) updateData.email = data.email || null;
  if (data.image !== undefined) {
    updateData.image = data.image || null;
  }
  if (data.mobileNumber !== undefined) updateData.mobileNumber = data.mobileNumber;

  try {
    const updatedUser = await prisma.user.update({
      where: { firebaseUid: req.user.uid },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (dbError) {
    if (dbError.code === 'P1017') {
      return res.status(500).json({
        success: false,
        message: 'Database connection timeout. The image may be too large. Please try a smaller image.',
      });
    }
    throw dbError;
  }

  return res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser,
  });
});
