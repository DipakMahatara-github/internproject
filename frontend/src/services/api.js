import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export function withAuth(token) {
  const instance = api.create ? api.create() : axios.create({ baseURL: api.defaults.baseURL });
  instance.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  return instance;
}

export default api;
