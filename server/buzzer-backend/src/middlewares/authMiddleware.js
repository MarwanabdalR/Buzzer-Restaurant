import asyncHandler from 'express-async-handler';
import admin from '../config/firebase.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Authentication Middleware
 * Verifies Firebase ID token from Authorization: Bearer <token>
 * Optionally fetches user from database and attaches to req.user
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Please provide a valid authentication token.',
    });
  }

  const token = parts[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      phone_number: decoded.phone_number || decoded.phoneNumber || null,
    };
    return next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
    });
  }
});

/**
 * Authenticate and Load User Middleware
 * Verifies token AND fetches user from database
 * Attaches full user object to req.user for role checking
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authenticateAndLoadUser = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Please provide a valid authentication token.',
    });
  }

  const token = parts[1];
  let decoded;
  try {
    decoded = await admin.auth().verifyIdToken(token);
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
    });
  }

  // Fetch user from database
  const user = await prisma.user.findUnique({
    where: { firebaseUid: decoded.uid },
    select: {
      id: true,
      fullName: true,
      mobileNumber: true,
      firebaseUid: true,
      type: true,
      email: true,
      image: true,
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found. Please register first.',
    });
  }

  // Attach user info to request
  req.user = {
    uid: decoded.uid,
    id: user.id,
    type: user.type,
    fullName: user.fullName,
    mobileNumber: user.mobileNumber,
    email: user.email,
    image: user.image,
    phone_number: decoded.phone_number || decoded.phoneNumber || null,
  };

  return next();
});

export default authenticate;

