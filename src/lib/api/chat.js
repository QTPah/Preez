import axios from 'axios';
import { auth } from '../../stores/auth';
import { get } from 'svelte/store';

const api = axios.create({
  baseURL: '/api/chat'
});

const getAuthHeader = () => {
  const authStore = get(auth);
  return { Authorization: `Bearer ${authStore.accessToken}` };
};

export const getUsers = async () => {
  try {
    const response = await api.get('/users', { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getMessages = async (userId) => {
  try {
    const response = await api.get(`/messages/${userId}`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const sendMessage = async (userId, text) => {
  try {
    const response = await api.post('/messages', { userId, text }, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
