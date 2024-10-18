import axios from 'axios';
import { apiRequest } from './apiUtils';

const api = axios.create({
  baseURL: '/api/users'
});

export const getAllUsers = async () => {
  try {
    return await apiRequest(api, 'get', '/');
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const addUser = async (userData) => {
  try {
    return await apiRequest(api, 'post', '/', userData);
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    return await apiRequest(api, 'put', `/${userId}`, userData);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    return await apiRequest(api, 'delete', `/${userId}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const getAllUserReports = async () => {
  try {
    return await apiRequest(api, 'get', '/reports');
  } catch (error) {
    console.error('Error fetching user reports:', error);
    throw error;
  }
};

export const updateUserReportStatus = async (reportId, action) => {
  try {
    return await apiRequest(api, 'patch', `/reports/${reportId}`, { action });
  } catch (error) {
    console.error('Error updating user report status:', error);
    throw error;
  }
};
