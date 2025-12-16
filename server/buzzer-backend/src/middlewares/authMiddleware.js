import asyncHandler from 'express-async-handler';
import admin from '../config/firebase.js';

// Middleware to verify Firebase ID token from Authorization: Bearer <token>
export const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Unauthorized' });
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
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

export default authenticate;

