// src/services/visitorService.js
import api from './api';

export const fetchVisitors = async () => {
  const response = await api.get('/users/');
  return response.data;
};

export const fetchVisitorProfile = async (id) => {
  const response = await api.get(`/visitors/${id}/`);
  return response.data;
};