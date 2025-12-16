import express from 'express';
import { createOrder, getMyOrders, updateOrderStatus, getAllOrders } from '../controllers/orderController.js';
import authenticate from '../middlewares/authMiddleware.js';
import { authenticateAndLoadUser } from '../middlewares/authMiddleware.js';
import requireAdmin from '../middlewares/adminMiddleware.js';

const router = express.Router();

/**
 * Order Routes
 * 
 * User routes (require authentication):
 * POST /api/orders - Create a new order (checkout)
 * GET /api/orders - Get all orders for the logged-in user
 * PATCH /api/orders/:id - Update order status (users can only cancel their own orders)
 * 
 * Admin routes (require authentication + admin role):
 * GET /api/orders/all - Get all orders from all users (admin dashboard)
 */

// User routes (require authentication)
router.post('/', authenticate, createOrder);
router.get('/', authenticate, getMyOrders);
router.patch('/:id', authenticate, updateOrderStatus);

// Admin routes (require authentication + admin role)
router.get('/all', authenticateAndLoadUser, requireAdmin, getAllOrders);

export default router;

