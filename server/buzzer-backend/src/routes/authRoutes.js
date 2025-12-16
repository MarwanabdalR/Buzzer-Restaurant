import express from 'express';
import { register, login, updateProfile } from '../controllers/authController.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * Authentication Routes
 * 
 * POST /api/auth/register - Register a new user
 * POST /api/auth/login - Login an existing user
 * PATCH /api/auth/profile - Update user profile (protected)
 */

router.post('/register', register);
router.post('/login', login);
router.patch('/profile', authenticate, updateProfile);

export default router;

