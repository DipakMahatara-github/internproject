import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeCartItemHandler, clearCartHandler } from '../controllers/cart.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/item/:itemId', updateCartItem);
router.delete('/item/:itemId', removeCartItemHandler);
router.delete('/clear', clearCartHandler);

export default router;
