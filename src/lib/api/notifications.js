import axios from 'axios';
import { apiRequest } from './apiUtils';
import { writable } from 'svelte/store';

const api = axios.create({
  baseURL: '/api/notifications',
});

export const notifications = writable([]);

export const getNotifications = async () => {
  const result = await apiRequest(api, 'get', '/');
  notifications.set(result);
  return result;
};

export const createNotification = (type, title, message) => 
  apiRequest(api, 'post', '/', { type, title, message });

export const markNotificationAsRead = async (id) => {
  const result = await apiRequest(api, 'patch', `/${id}/read`);
  notifications.update(n => n.map(notification => 
    notification._id === id ? { ...notification, read: true } : notification
  ));
  return result;
};

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
