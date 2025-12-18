import express from 'express';
import {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from '../controllers/restaurantController.js';
import { authenticateAndLoadUser } from '../middlewares/authMiddleware.js';
import requireAdmin from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);
router.post('/', authenticateAndLoadUser, requireAdmin, createRestaurant);
router.patch('/:id', authenticateAndLoadUser, requireAdmin, updateRestaurant);
router.delete('/:id', authenticateAndLoadUser, requireAdmin, deleteRestaurant);

export default router;

