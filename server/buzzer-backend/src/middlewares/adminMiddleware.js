import asyncHandler from 'express-async-handler';

export const requireAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user || !req.user.uid) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  if (!req.user.type) {
    return res.status(403).json({
      success: false,
      message: 'User type not found. Please use authenticateAndLoadUser middleware first.',
    });
  }

  if (req.user.type !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }

  return next();
});

export default requireAdmin;
