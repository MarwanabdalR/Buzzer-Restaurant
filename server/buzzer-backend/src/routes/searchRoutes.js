import express from 'express';
import { searchRecommendations } from '../controllers/searchController.js';

const router = express.Router();

router.get('/recommendations', searchRecommendations);

export default router;

