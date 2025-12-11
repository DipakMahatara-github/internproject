import api from './api.js';

export async function fetchCategories() {
  const res = await api.get('/categories');
  return res.data;
}

export async function fetchProducts(params = {}) {
  const res = await api.get('/products', { params });
  return res.data;
}

export async function fetchProductById(id) {
  const res = await api.get(`/products/${id}`);
  return res.data;
}
