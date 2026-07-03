import axios from 'axios';

// URL de base de l'API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token Firebase
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('firebaseToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs 401 (non autorisé)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('firebaseToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;