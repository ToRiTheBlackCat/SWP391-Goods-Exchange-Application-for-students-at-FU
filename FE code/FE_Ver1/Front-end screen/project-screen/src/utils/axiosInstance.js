import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://goodsexchangefu-api.azurewebsites.net/', // Base URL of backend
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Mock function to refresh token locally
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const expirationTime = localStorage.getItem('expirationTime');

  // Kiểm tra nếu không phải đang ở trang login và có token
  if (config.url !== '/login' && token) {
    if (new Date().getTime() > expirationTime) {
      localStorage.removeItem('token');
      localStorage.removeItem('expirationTime');
      if (window.confirm('Your session has expired. Click OK to log in again.')) {
        window.location.href = '/login'; // Chuyển hướng người dùng về trang login
      }
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
