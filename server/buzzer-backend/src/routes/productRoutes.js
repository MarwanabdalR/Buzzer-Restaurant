import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { authenticateAndLoadUser } from '../middlewares/authMiddleware.js';
import requireAdmin from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authenticateAndLoadUser, requireAdmin, createProduct);
router.put('/:id', authenticateAndLoadUser, requireAdmin, updateProduct);
router.delete('/:id', authenticateAndLoadUser, requireAdmin, deleteProduct);

export default router;
