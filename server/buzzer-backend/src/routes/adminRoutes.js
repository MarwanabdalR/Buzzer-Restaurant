import express from 'express';
import { getDashboardStats, getAllUsers } from '../controllers/adminController.js';
import { authenticateAndLoadUser } from '../middlewares/authMiddleware.js';
import { requireAdmin } from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.get('/stats', authenticateAndLoadUser, requireAdmin, getDashboardStats);
router.get('/users', authenticateAndLoadUser, requireAdmin, getAllUsers);

export default router;
