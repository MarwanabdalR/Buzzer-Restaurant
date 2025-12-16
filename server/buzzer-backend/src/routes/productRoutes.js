import express from 'express';
import upload from '../config/cloudinary.js';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import authenticate from '../middlewares/authMiddleware.js';
import requireAdmin from '../middlewares/adminMiddleware.js';

const router = express.Router();

/**
 * Product Routes
 * 
 * Public routes (no authentication):
 * GET /api/products - Get all products
 * GET /api/products/:id - Get product by ID
 * 
 * Admin-only routes (require authentication + admin role):
 * POST /api/products - Create product
 * PUT /api/products/:id - Update product
 * DELETE /api/products/:id - Delete product
 */

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin-only routes
router.post('/', authenticate, requireAdmin, upload.single('image'), createProduct);
router.put('/:id', authenticate, requireAdmin, upload.single('image'), updateProduct);
router.delete('/:id', authenticate, requireAdmin, deleteProduct);

export default router;

