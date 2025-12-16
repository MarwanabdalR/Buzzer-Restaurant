import express from 'express';
import { register, login, updateProfile } from '../controllers/authController.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.patch('/profile', authenticate, updateProfile);

export default router;
