import { withAuth } from './api.js';

export async function fetchCart(token) {
  const client = withAuth(token);
  const res = await client.get('/cart');
  return res.data;
}

export async function addToCart(token, productId, quantity) {
  const client = withAuth(token);
  const res = await client.post('/cart/add', { productId, quantity });
  return res.data;
}

export async function updateCartItem(token, itemId, quantity) {
  const client = withAuth(token);
  const res = await client.put(`/cart/item/${itemId}`, { quantity });
  return res.data;
}

export async function removeCartItem(token, itemId) {
  const client = withAuth(token);
  const res = await client.delete(`/cart/item/${itemId}`);
  return res.data;
}

export async function clearCart(token) {
  const client = withAuth(token);
  const res = await client.delete('/cart/clear');
  return res.data;
}
