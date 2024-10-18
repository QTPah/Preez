import { apiRequest } from './apiUtils';
import axios from 'axios';

const api = axios.create({
  baseURL: '/api/statistics'
});

export const getStatistics = async () => {
  try {
    const response = await apiRequest(api, 'get', '/');
    return response;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
};
