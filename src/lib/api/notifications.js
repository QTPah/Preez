import axios from 'axios';
import { auth } from '../../stores/auth';
import { get } from 'svelte/store';

const api = axios.create({
  baseURL: '/api/notifications',
});

const getAuthHeader = () => {
  const authStore = get(auth);
  return { Authorization: `Bearer ${authStore.accessToken}` };
};

export const getNotifications = () => api.get('/', { headers: getAuthHeader() });

export const createNotification = (type, title, message) => 
  api.post('/', { type, title, message }, { headers: getAuthHeader() });

export const markNotificationAsRead = (id) => 
  api.patch(`/${id}/read`, null, { headers: getAuthHeader() });

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
