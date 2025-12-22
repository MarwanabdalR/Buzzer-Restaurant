import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { authenticateAndLoadUser } from '../middlewares/authMiddleware.js';
import requireAdmin from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', authenticateAndLoadUser, requireAdmin, createCategory);
router.put('/:id', authenticateAndLoadUser, requireAdmin, updateCategory);
router.delete('/:id', authenticateAndLoadUser, requireAdmin, deleteCategory);

export default router;
