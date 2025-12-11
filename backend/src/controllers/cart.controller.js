import { getCartItemsDetailed, addOrUpdateCartItem, updateCartItemQuantity, removeCartItem, clearCart } from '../models/cart.model.js';

export async function getCart(req, res, next) {
  try {
    const items = await getCartItemsDetailed(req.user.id);
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function addToCart(req, res, next) {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'productId and quantity are required' });
    }
    await addOrUpdateCartItem(req.user.id, productId, quantity);
    res.status(201).json({ message: 'Item added to cart' });
  } catch (err) {
    next(err);
  }
}

export async function updateCartItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    if (!quantity) {
      return res.status(400).json({ message: 'quantity is required' });
    }
    await updateCartItemQuantity(itemId, quantity);
    res.json({ message: 'Cart item updated' });
  } catch (err) {
    next(err);
  }
}

export async function removeCartItemHandler(req, res, next) {
  try {
    const { itemId } = req.params;
    await removeCartItem(itemId);
    res.json({ message: 'Cart item removed' });
  } catch (err) {
    next(err);
  }
}

export async function clearCartHandler(req, res, next) {
  try {
    await clearCart(req.user.id);
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    next(err);
  }
}
