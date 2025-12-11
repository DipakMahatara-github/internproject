import { Router } from 'express';
import { createOrderHandler, listMyOrders, listAllOrders, updateOrderStatusHandler } from '../controllers/order.controller.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/', authMiddleware, createOrderHandler);
router.get('/my', authMiddleware, listMyOrders);
router.get('/', authMiddleware, adminMiddleware, listAllOrders);
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatusHandler);

export default router;
