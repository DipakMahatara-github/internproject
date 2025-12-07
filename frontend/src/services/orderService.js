import { withAuth } from './api.js';

export async function createOrder(token) {
  const client = withAuth(token);
  const res = await client.post('/orders');
  return res.data;
}

export async function fetchMyOrders(token) {
  const client = withAuth(token);
  const res = await client.get('/orders/my');
  return res.data;
}

export async function fetchAllOrders(token) {
  const client = withAuth(token);
  const res = await client.get('/orders');
  return res.data;
}

export async function updateOrderStatus(token, id, status) {
  const client = withAuth(token);
  const res = await client.put(`/orders/${id}/status`, { status });
  return res.data;
}
