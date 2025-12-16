import express from 'express';
import { createOrder, getMyOrders, updateOrderStatus } from '../controllers/orderController.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * Order Routes
 * 
 * All routes are protected with authentication middleware
 * 
 * POST /api/orders - Create a new order (checkout)
 * GET /api/orders - Get all orders for the logged-in user
 * PATCH /api/orders/:id - Update order status (COMPLETED or CANCELLED)
 */

// Apply authentication middleware to all routes
router.use(authenticate);

router.post('/', createOrder);
router.get('/', getMyOrders);
router.patch('/:id', updateOrderStatus);

export default router;

