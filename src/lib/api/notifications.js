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
