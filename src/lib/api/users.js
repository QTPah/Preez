import axios from 'axios';
import { auth } from '../../stores/auth.js';
import { get } from 'svelte/store';

const api = axios.create({
  baseURL: '/api/users'
});

const getAuthHeader = () => {
  const authStore = get(auth);
  return { Authorization: `Bearer ${authStore.accessToken}` };
};

export const getAllUsers = async () => {
  try {
    const response = await api.get('/', {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const addUser = async (userData) => {
  try {
    const response = await api.post('/', userData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/${userId}`, userData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/${userId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const getAllUserReports = async () => {
  try {
    const response = await api.get('/reports', {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user reports:', error);
    throw error;
  }
};

export const updateUserReportStatus = async (reportId, action) => {
  try {
    const response = await api.patch(`/reports/${reportId}`, { action }, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user report status:', error);
    throw error;
  }
};
