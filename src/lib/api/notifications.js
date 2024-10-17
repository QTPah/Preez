import axios from 'axios';
import { apiRequest } from './apiUtils';

const api = axios.create({
  baseURL: '/api/notifications',
});

export const getNotifications = () => apiRequest(api, 'get', '/');

export const createNotification = (type, title, message) => 
  apiRequest(api, 'post', '/', { type, title, message });

export const markNotificationAsRead = (id) => 
  apiRequest(api, 'patch', `/${id}/read`);

let socket;

export const connectWebSocket = (token) => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  socket = new WebSocket(`${protocol}//${host}/ws`);

  socket.onopen = () => {
    console.log('WebSocket connected');
    socket.send(JSON.stringify({ type: 'auth', token }));
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'notification') {
      // Handle new notification
      console.log('New notification:', data.notification);
      // You can dispatch an action or update your state here
    }
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  socket.onclose = () => {
    console.log('WebSocket disconnected');
  };
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.close();
  }
};
