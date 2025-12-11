import { Router } from 'express';
import { listProductReviews, createOrUpdateReview } from '../controllers/review.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/products/:productId/reviews', listProductReviews);
router.post('/products/:productId/reviews', authMiddleware, createOrUpdateReview);

export default router;
