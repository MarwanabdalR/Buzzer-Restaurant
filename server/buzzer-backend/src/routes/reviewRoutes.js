import express from 'express';
import {
  createReview,
  getProductReviews,
  deleteReview,
} from '../controllers/reviewController.js';
import { authenticateAndLoadUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/:productId', authenticateAndLoadUser, createReview);
router.delete('/:id', authenticateAndLoadUser, deleteReview);

export default router;

