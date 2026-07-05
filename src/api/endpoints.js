// src/api/endpoints.js
import api from './axiosConfig';

// ─── AUTHENTIFICATION ───
export const verifyToken = (token) => api.post('/auth/verify', { token });
export const getMe = () => api.get('/auth/me');

// ─── PRODUITS ───
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const getLowStock = () => api.get('/products/low-stock');
export const rateProduct = (id, rating) => api.post(`/products/${id}/rating`, { rating });

// ─── SERVICES ───
export const getServices = (params) => api.get('/services', { params });
export const getService = (id) => api.get(`/services/${id}`);
export const createService = (data) => api.post('/services', data);
export const updateService = (id, data) => api.put(`/services/${id}`, data);
export const deleteService = (id) => api.delete(`/services/${id}`);

// ─── CLIENTS ───
export const getClients = (params) => api.get('/clients', { params });
export const getClient = (id) => api.get(`/clients/${id}`);
export const createClient = (data) => api.post('/clients', data);
export const updateClient = (id, data) => api.put(`/clients/${id}`, data);
export const deleteClient = (id) => api.delete(`/clients/${id}`);
export const updateClientStats = (id, orderTotal) => api.put(`/clients/${id}/stats`, { orderTotal });

// ─── FOURNISSEURS ───
export const getSuppliers = () => api.get('/suppliers');
export const getSupplier = (id) => api.get(`/suppliers/${id}`);
export const createSupplier = (data) => api.post('/suppliers', data);
export const updateSupplier = (id, data) => api.put(`/suppliers/${id}`, data);
export const deleteSupplier = (id) => api.delete(`/suppliers/${id}`);

// ─── COMMANDES ───
export const getOrders = (params) => api.get('/orders', { params });
export const getOrder = (id) => api.get(`/orders/${id}`);
export const createOrder = (data) => api.post('/orders', data);
export const updateOrder = (id, data) => api.put(`/orders/${id}`, data);
export const updateOrderStatus = (id, status, note) => api.put(`/orders/${id}/status`, { status, note });
export const deleteOrder = (id) => api.delete(`/orders/${id}`);

// ─── DEMANDES DE SERVICES ───
export const getRequests = (params) => api.get('/requests', { params });
export const getRequest = (id) => api.get(`/requests/${id}`);
export const createRequest = (data) => api.post('/requests', data);
export const updateRequest = (id, data) => api.put(`/requests/${id}`, data);
export const deleteRequest = (id) => api.delete(`/requests/${id}`);

// ─── DEVIS ───
export const getQuotes = (params) => api.get('/quotes', { params });
export const getQuote = (id) => api.get(`/quotes/${id}`);
export const createQuote = (data) => api.post('/quotes', data);
export const updateQuote = (id, data) => api.put(`/quotes/${id}`, data);
export const deleteQuote = (id) => api.delete(`/quotes/${id}`);

// ─── ÉVÉNEMENTS (Planning) ───
export const getEvents = (params) => api.get('/events', { params });
export const getEvent = (id) => api.get(`/events/${id}`);
export const createEvent = (data) => api.post('/events', data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

// ─── OFFRES ───
export const getOffers = (params) => api.get('/offers', { params });
export const getOffer = (id) => api.get(`/offers/${id}`);
export const createOffer = (data) => api.post('/offers', data);
export const updateOffer = (id, data) => api.put(`/offers/${id}`, data);
export const deleteOffer = (id) => api.delete(`/offers/${id}`);