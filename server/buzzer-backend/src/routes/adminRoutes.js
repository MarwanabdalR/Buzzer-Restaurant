import express from 'express';
import { getDashboardStats } from '../controllers/adminController.js';
import { authenticateAndLoadUser } from '../middlewares/authMiddleware.js';
import requireAdmin from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.get('/stats', authenticateAndLoadUser, requireAdmin, getDashboardStats);

export default router;

