import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const requireAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user || !req.user.uid) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

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

  if (user.type !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }

  req.user.id = user.id;
  req.user.type = user.type;
  req.user.fullName = user.fullName;

  return next();
});

export default requireAdmin;
