import axios from 'axios';
import { auth } from '../../stores/auth';
import { get } from 'svelte/store';

const api = axios.create({
  baseURL: '/api/offers'
});

const getAuthHeader = () => {
  const authStore = get(auth);
  return { Authorization: `Bearer ${authStore.accessToken}` };
};

export const getAllOffers = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/', {
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
    const response = await api.get(`/${id}`, {
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
    const response = await api.put(`/${id}`, offerData, {
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
    const response = await api.delete(`/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting offer with id ${id}:`, error);
    throw error;
  }
};

export const reportOffer = async (id, reportData) => {
  try {
    const response = await api.post(`/${id}/report`, reportData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Error reporting offer with id ${id}:`, error);
    throw error;
  }
};

export const getAllOfferReports = async () => {
  try {
    const response = await api.get('/reports', {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching offer reports:', error);
    throw error;
  }
};

export const updateOfferReportStatus = async (reportId, action) => {
  try {
    const response = await api.patch(`/reports/${reportId}`, { action }, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error updating offer report status:', error);
    throw error;
  }
};
