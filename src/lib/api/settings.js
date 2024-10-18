import { api } from './api';

export const getAboutPageContent = async () => {
  try {
    const response = await api.get('/settings/about');
    return response.data.content;
  } catch (error) {
    console.error('Error fetching About page content:', error);
    throw error;
  }
};

export const updateAboutPageContent = async (content) => {
  try {
    const response = await api.put('/settings/about', { content });
    return response.data;
  } catch (error) {
    console.error('Error updating About page content:', error);
    throw error;
  }
};
