import axios from 'axios';
import { apiRequest } from './apiUtils';

const api = axios.create({
  baseURL: '/api/offers'
});

export const getAllOffers = async (page = 1, limit = 10) => {
  try {
    return await apiRequest(api, 'get', '/', null, {
      params: { page, limit, populate: 'seller' }
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    throw error;
  }
};

export const getOfferById = async (id) => {
  try {
    return await apiRequest(api, 'get', `/${id}`);
  } catch (error) {
    console.error(`Error fetching offer with id ${id}:`, error);
    throw error;
  }
};

export const updateOffer = async (id, offerData) => {
  try {
    return await apiRequest(api, 'put', `/${id}`, offerData);
  } catch (error) {
    console.error(`Error updating offer with id ${id}:`, error);
    throw error;
  }
};

export const deleteOffer = async (id) => {
  try {
    return await apiRequest(api, 'delete', `/${id}`);
  } catch (error) {
    console.error(`Error deleting offer with id ${id}:`, error);
    throw error;
  }
};

export const reportOffer = async (id, reportData) => {
  try {
    return await apiRequest(api, 'post', `/${id}/report`, reportData);
  } catch (error) {
    console.error(`Error reporting offer with id ${id}:`, error);
    throw error;
  }
};

export const getAllOfferReports = async () => {
  try {
    return await apiRequest(api, 'get', '/reports');
  } catch (error) {
    console.error('Error fetching offer reports:', error);
    throw error;
  }
};

export const updateOfferReportStatus = async (reportId, action) => {
  try {
    return await apiRequest(api, 'patch', `/reports/${reportId}`, { action });
  } catch (error) {
    console.error('Error updating offer report status:', error);
    throw error;
  }
};
