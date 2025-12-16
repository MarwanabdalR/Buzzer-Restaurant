import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import upload from '../config/cloudinary.js';
import authenticate from '../middlewares/authMiddleware.js';
import requireAdmin from '../middlewares/adminMiddleware.js';

const router = express.Router();

/**
 * Category Routes
 * 
 * Public routes (no authentication):
 * GET /api/categories - Get all categories
 * GET /api/categories/:id - Get category by ID
 * 
 * Admin-only routes (require authentication + admin role):
 * POST /api/categories - Create category
 * PUT /api/categories/:id - Update category
 * DELETE /api/categories/:id - Delete category
 */

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Admin-only routes
router.post('/', authenticate, requireAdmin, upload.single('image'), createCategory);
router.put('/:id', authenticate, requireAdmin, upload.single('image'), updateCategory);
router.delete('/:id', authenticate, requireAdmin, deleteCategory);

export default router;

