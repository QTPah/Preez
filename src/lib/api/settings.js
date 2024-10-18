import { apiRequest } from './apiUtils.js';
import axios from 'axios';

const api = axios.create({
  baseURL: '/api/settings'
});

export const getAboutPageContent = async () => {
  try {
    const response = await apiRequest(api, 'get', '/about');
    return response.content;
  } catch (error) {
    console.error('Error fetching About page content:', error);
    throw error;
  }
};

export const updateAboutPageContent = async (content) => {
  try {
    return await apiRequest(api, 'put', '/about', { content });
  } catch (error) {
    console.error('Error updating About page content:', error);
    throw error;
  }
};
