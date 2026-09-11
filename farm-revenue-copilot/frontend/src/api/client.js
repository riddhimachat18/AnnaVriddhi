/**
 * api/client.js
 * Base Axios instance — all API modules import from here.
 * Base URL is driven by VITE_API_BASE_URL env var.
 */
import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token if present
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handler
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: surface toast / alert on 401, 500, network errors
    return Promise.reject(error);
  }
);

export default client;
