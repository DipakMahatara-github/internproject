import { Router } from 'express';
import { listCategories, createCategoryHandler, updateCategoryHandler, deleteCategoryHandler } from '../controllers/category.controller.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', listCategories);
router.post('/', authMiddleware, adminMiddleware, createCategoryHandler);
router.put('/:id', authMiddleware, adminMiddleware, updateCategoryHandler);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCategoryHandler);

export default router;
