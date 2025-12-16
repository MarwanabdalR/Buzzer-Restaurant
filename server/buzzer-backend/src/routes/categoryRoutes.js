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

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', authenticate, requireAdmin, upload.single('image'), createCategory);
router.put('/:id', authenticate, requireAdmin, upload.single('image'), updateCategory);
router.delete('/:id', authenticate, requireAdmin, deleteCategory);

export default router;
