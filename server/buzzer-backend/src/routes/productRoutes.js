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

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, requireAdmin, upload.single('image'), createProduct);
router.put('/:id', authenticate, requireAdmin, upload.single('image'), updateProduct);
router.delete('/:id', authenticate, requireAdmin, deleteProduct);

export default router;
