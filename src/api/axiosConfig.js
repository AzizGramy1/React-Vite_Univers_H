// src/api/axiosConfig.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000 // 30 secondes
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
  (error) => {
    console.error('Erreur de requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs 401 (non autorisé)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('firebaseToken');
      // Rediriger vers la page de connexion
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Afficher les erreurs en console pour le débogage
    if (error.response) {
      console.error('Erreur API:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;