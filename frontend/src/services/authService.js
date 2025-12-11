import api, { withAuth } from './api.js';

export async function register(username, email, password) {
  const res = await api.post('/auth/register', { username, email, password });
  return res.data;
}

export async function login(email, password) {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
}

export async function getCurrentUser(token) {
  const client = withAuth(token);
  const res = await client.get('/auth/me');
  return res.data;
}
