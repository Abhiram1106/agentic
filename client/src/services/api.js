import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// Request interceptor for adding auth token
API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling 401s
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('Network error or server unreachable');
    }
    if (error.response && error.response.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
