import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

export const getAllOffers = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/offers', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching offers:', error);
    throw error;
  }
};

export const getOfferById = async (id) => {
  try {
    const response = await api.get(`/offers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching offer with id ${id}:`, error);
    throw error;
  }
};
