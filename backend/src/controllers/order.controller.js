import { createOrderFromCart, getUserOrders, getAllOrders, updateOrderStatus } from '../models/order.model.js';

export async function createOrderHandler(req, res, next) {
  try {
    const orderId = await createOrderFromCart(req.user.id);
    res.status(201).json({ id: orderId, message: 'Order created' });
  } catch (err) {
    next(err);
  }
}

export async function listMyOrders(req, res, next) {
  try {
    const orders = await getUserOrders(req.user.id);
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

export async function listAllOrders(req, res, next) {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatusHandler(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'status is required' });
    }
    await updateOrderStatus(id, status);
    res.json({ message: 'Order status updated' });
  } catch (err) {
    next(err);
  }
}
