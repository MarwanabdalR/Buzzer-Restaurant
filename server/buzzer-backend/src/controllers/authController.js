import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import admin from '../config/firebase.js';
import { registerSchema, loginSchema, updateProfileSchema } from '../utils/authValidation.js';

const prisma = new PrismaClient();

/**
 * Validation helper function
 * @param {Joi.Schema} schema - Joi validation schema
 * @param {Object} payload - Data to validate
 * @returns {Promise<Object>} Validated data
 */
const validate = async (schema, payload) =>
  schema.validateAsync(payload, { abortEarly: false });

/**
 * Register Controller
 * POST /api/auth/register
 * 
 * Flow:
 * 1. Validate request body (fullName, mobileNumber, idToken)
 * 2. Verify Firebase ID token
 * 3. Check if user already exists (by firebaseUid OR mobileNumber)
 * 4. Create new user if not exists
 * 5. Return 201 Created with user data
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const register = asyncHandler(async (req, res) => {
  // Step 1: Validate request body
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

  // Step 2: Verify Firebase ID token
  let decoded;
  try {
    decoded = await admin.auth().verifyIdToken(data.idToken);
  } catch (err) {
    // Handle different Firebase token errors
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

  // Step 3: Check if user already exists (by firebaseUid OR mobileNumber)
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

  // Step 4: Create new user (default type is "user")
  const user = await prisma.user.create({
    data: {
      fullName: data.fullName,
      mobileNumber: data.mobileNumber,
      firebaseUid,
      email: null,
      password: null,
      image: null,
      type: 'user', // Default type is "user"
    },
  });

  // Step 5: Return success response
  return res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: user,
  });
});

/**
 * Login Controller
 * POST /api/auth/login
 * 
 * Flow:
 * 1. Validate request body (idToken)
 * 2. Verify Firebase ID token
 * 3. Extract Firebase UID
 * 4. Find user in database by firebaseUid
 * 5. Return user data if found, 404 if not found
 * 
 * Note: Frontend uses 404 response to redirect user to registration page
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const login = asyncHandler(async (req, res) => {
  // Step 1: Validate request body
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

  // Step 2: Verify Firebase ID token
  let decoded;
  try {
    decoded = await admin.auth().verifyIdToken(data.idToken);
  } catch (err) {
    // Handle different Firebase token errors
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

  // Step 3: Find user in database
  const user = await prisma.user.findUnique({
    where: { firebaseUid },
  });

  // Step 4: Handle user not found scenario
  // Frontend uses 404 to redirect to registration page
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found. Please register.',
    });
  }

  // Step 5: Return success response with user data
  return res.status(200).json({
    success: true,
    message: 'Login successful',
    data: user,
  });
});

/**
 * Update Profile Controller
 * PATCH /api/auth/profile
 * 
 * Flow:
 * 1. Validate request body (fullName, email, image, mobileNumber - all optional)
 * 2. Get user from database using req.user.uid (firebaseUid from authMiddleware)
 * 3. Check if mobileNumber or email already exists (if being updated)
 * 4. Update user profile with provided fields
 * 5. Return updated user data
 * 
 * @param {Object} req - Express request object (req.user.uid available from authMiddleware)
 * @param {Object} res - Express response object
 */
export const updateProfile = asyncHandler(async (req, res) => {
  // Step 1: Validate request body
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

  // Step 2: Get user from database
  const user = await prisma.user.findUnique({
    where: { firebaseUid: req.user.uid },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found. Please register first.',
    });
  }

  // Step 3: Check for conflicts if mobileNumber or email is being updated
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

  if (data.email && data.email !== user.email) {
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'Email already in use by another account',
      });
    }
  }

  // Step 4: Prepare update data (only include fields that are provided)
  // Security: Prevent users from changing their own type (only admins can do this manually in DB)
  if (data.type !== undefined && data.type !== user.type) {
    return res.status(403).json({
      success: false,
      message: 'You cannot change your user type. Please contact an administrator.',
    });
  }

  const updateData = {};
  if (data.fullName !== undefined) updateData.fullName = data.fullName;
  if (data.email !== undefined) updateData.email = data.email || null;
  if (data.image !== undefined) updateData.image = data.image || null;
  if (data.mobileNumber !== undefined) updateData.mobileNumber = data.mobileNumber;
  // Type field is intentionally excluded - users cannot change their own type

  // Step 5: Update user profile
  const updatedUser = await prisma.user.update({
    where: { firebaseUid: req.user.uid },
    data: updateData,
  });

  // Step 6: Return success response
  return res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser,
  });
});

