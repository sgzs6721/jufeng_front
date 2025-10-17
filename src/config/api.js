import axios from 'axios';

const api = axios.create({
  baseURL: '/jufeng/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || '网络错误，请稍后重试';
    return Promise.reject(new Error(message));
  }
);

export default api;

