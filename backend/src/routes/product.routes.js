import { Router } from 'express';
import { listProducts, getProduct, createProductHandler, updateProductHandler, deleteProductHandler } from '../controllers/product.controller.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { uploadProductImage } from '../middleware/upload.js';

const router = Router();

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', authMiddleware, adminMiddleware, uploadProductImage.single('image'), createProductHandler);
router.put('/:id', authMiddleware, adminMiddleware, uploadProductImage.single('image'), updateProductHandler);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProductHandler);

export default router;
