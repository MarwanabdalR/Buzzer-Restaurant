import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Admin Middleware
 * Verifies that the authenticated user is an admin
 * Must be used after authenticate middleware
 * 
 * @param {Object} req - Express request object (requires req.user.uid from authenticate middleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const requireAdmin = asyncHandler(async (req, res, next) => {
  // Ensure user is authenticated (should be set by authenticate middleware)
  if (!req.user || !req.user.uid) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  // Fetch user from database to check type
  const user = await prisma.user.findUnique({
    where: { firebaseUid: req.user.uid },
    select: { id: true, type: true, fullName: true },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found. Please register first.',
    });
  }

  // Check if user is admin
  if (user.type !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }

  // Attach user info to request for use in controllers
  req.user.id = user.id;
  req.user.type = user.type;
  req.user.fullName = user.fullName;

  return next();
});

export default requireAdmin;

