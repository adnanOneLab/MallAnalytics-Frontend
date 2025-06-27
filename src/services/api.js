// src/services/api.js
import axios from 'axios';

// Use local IP address for development to allow mobile access
const BACKEND = import.meta.env.VITE_BACKEND_URL;
// const BASE_URL = BACKEND ? `${BACKEND}/api` : "http://localhost:8000/api";
const BASE_URL='https://mallanalytics-backend.onrender.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60 seconds timeout for photo uploads
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

    // For validation errors (400), preserve the original error structure
    if (error.response.status === 400) {
      // Re-throw the original error to preserve response.data for field-specific errors
      throw error;
    }

    // Handle other errors
    const errorMessage = error.response.data?.detail || 
                        error.response.data?.message || 
                        error.message || 
                        'An unexpected error occurred';
    throw new Error(errorMessage);
  }
);

// Campaign Steps API
export const getCampaignSteps = (campaignId) => api.get(`/campaigns/${campaignId}/steps/`);
export const createCampaignStep = (campaignId, data) => api.post(`/campaigns/${campaignId}/steps/`, data);
export const updateCampaignStep = (campaignId, stepId, data) => api.put(`/campaigns/${campaignId}/steps/${stepId}/`, data);
export const deleteCampaignStep = (campaignId, stepId) => api.delete(`/campaigns/${campaignId}/steps/${stepId}/`);
export const scheduleCampaignStep = (stepId, data) => api.post(`/steps/${stepId}/schedule/`, data);

export const getSendGridSenders = () => api.get('/sendgrid/senders/');
export const getSuppressionGroups = () => api.get('/sendgrid/suppression-groups/');

export default api;
