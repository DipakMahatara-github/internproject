import api, { withAuth } from './api.js';

export async function fetchReviews(productId) {
  const res = await api.get(`/products/${productId}/reviews`);
  return res.data;
}

export async function submitReview(token, productId, rating, comment) {
  const client = withAuth(token);
  const res = await client.post(`/products/${productId}/reviews`, { rating, comment });
  return res.data;
}
