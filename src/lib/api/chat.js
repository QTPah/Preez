import axios from 'axios';
import { apiRequest } from './apiUtils';

const api = axios.create({
  baseURL: '/api/chat'
});

export const getUsers = () => apiRequest(api, 'get', '/users');

export const getMessages = (userId) => apiRequest(api, 'get', `/messages/${userId}`);

export const sendMessage = (userId, text) => apiRequest(api, 'post', '/messages', { userId, text });
