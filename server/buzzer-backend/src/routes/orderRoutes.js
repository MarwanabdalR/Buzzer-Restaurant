import express from 'express';
import { createOrder, getMyOrders, updateOrderStatus, getAllOrders } from '../controllers/orderController.js';
import authenticate from '../middlewares/authMiddleware.js';
import { authenticateAndLoadUser } from '../middlewares/authMiddleware.js';
import requireAdmin from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.post('/', authenticate, createOrder);
router.get('/', authenticate, getMyOrders);
router.patch('/:id', authenticate, updateOrderStatus);
router.get('/all', authenticateAndLoadUser, requireAdmin, getAllOrders);

export default router;
