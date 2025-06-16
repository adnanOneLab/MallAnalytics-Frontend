// src/services/api.js
import axios from 'axios';

// Hardcoded API URL for development
const BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds timeout for photo uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      // Network error (no response from server)
      console.error('Network error:', error);
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    
    // Handle specific error cases
    if (error.response.status === 413) {
      throw new Error('The photo file is too large. Please choose a smaller image.');
    }
    
    if (error.response.status === 504) {
      throw new Error('The server took too long to respond. Please try again.');
    }

    // Handle other errors
    const errorMessage = error.response.data?.detail || 
                        error.response.data?.message || 
                        error.message || 
                        'An unexpected error occurred';
    throw new Error(errorMessage);
  }
);

export default api;
