import axios from 'axios';
import { auth } from '../../stores/auth';
import { get } from 'svelte/store';

const api = axios.create({
  baseURL: '/api'
});

const getAuthHeader = () => {
  const authStore = get(auth);
  return { Authorization: `Bearer ${authStore.accessToken}` };
};

export const getAllOffers = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/offers', {
      params: { page, limit, populate: 'seller' },
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching offers:', error);
    throw error;
  }
};

export const getOfferById = async (id) => {
  try {
    const response = await api.get(`/offers/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching offer with id ${id}:`, error);
    throw error;
  }
};

export const updateOffer = async (id, offerData) => {
  try {
    const response = await api.put(`/offers/${id}`, offerData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating offer with id ${id}:`, error);
    throw error;
  }
};

export const deleteOffer = async (id) => {
  try {
    const response = await api.delete(`/offers/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting offer with id ${id}:`, error);
    throw error;
  }
};
