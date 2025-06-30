// src/services/api.js
import axios from 'axios';
import { getAccessToken } from '../context/auth0-provider-with-history';
// Use local IP address for development to allow mobile access
const BACKEND = import.meta.env.VITE_API_URL;
const BASE_URL = BACKEND ? `${BACKEND}` : "http://localhost:8000/";
// const BASE_URL='https://wise-video-api-dev.wiseagents.com/';



const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60 seconds timeout for photo uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      let token = await getAccessToken()
      token = token?.id_token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // Silently continue without token for unauthenticated requests (like registration)
      console.log('No authentication token available, proceeding without authorization header');
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
export const getCampaignSteps = (campaignId) => api.get(`api/campaigns/${campaignId}/steps/`);
export const createCampaignStep = (campaignId, data) => {
  if (data instanceof FormData) {
    return api.post(`api/campaigns/${campaignId}/steps/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
  return api.post(`api/campaigns/${campaignId}/steps/`, data);
};
export const updateCampaignStep = (campaignId, stepId, data) => {
  if (data instanceof FormData) {
    return api.put(`api/campaigns/${campaignId}/steps/${stepId}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
  return api.put(`api/campaigns/${campaignId}/steps/${stepId}/`, data);
};
export const deleteCampaignStep = (campaignId, stepId) => api.delete(`api/campaigns/${campaignId}/steps/${stepId}/`);
export const scheduleCampaignStep = (stepId, data) => api.post(`api/steps/${stepId}/schedule/`, data);

export const getSendGridSenders = () => api.get('api/sendgrid/senders/');
export const getSuppressionGroups = () => api.get('api/sendgrid/suppression-groups/');

export default api;
