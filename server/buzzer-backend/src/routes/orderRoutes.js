import express from 'express';
import { createOrder, getMyOrders, getOrderById, updateOrderStatus, getAllOrders, deleteOrder } from '../controllers/orderController.js';
import authenticate from '../middlewares/authMiddleware.js';
import { authenticateAndLoadUser } from '../middlewares/authMiddleware.js';
import requireAdmin from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.post('/', authenticate, createOrder);
router.get('/', authenticate, getMyOrders);
router.get('/all', authenticateAndLoadUser, requireAdmin, getAllOrders); // Must be before /:id
router.get('/:id', authenticate, getOrderById);
router.patch('/:id', authenticate, updateOrderStatus);
router.delete('/:id', authenticateAndLoadUser, requireAdmin, deleteOrder);

export default router;
