import express from 'express';
import { register, login } from '../controllers/authController.js';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import authenticate, { authenticateAndLoadUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateAndLoadUser, getProfile);
router.patch('/profile', authenticate, updateProfile);

export default router;
