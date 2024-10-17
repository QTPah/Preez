import { writable } from 'svelte/store';
import { getNotifications, markNotificationAsRead, connectWebSocket, disconnectWebSocket } from '$lib/api/notifications';

export const notifications = writable([]);

export const initializeNotifications = async (token) => {
  try {
    const response = await getNotifications();
    notifications.set(response.data);
    connectWebSocket(token);
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
};

export const addNotification = (notification) => {
  notifications.update(n => [notification, ...n]);
};

export const markAsRead = async (id) => {
  try {
    await markNotificationAsRead(id);
    notifications.update(n => n.map(notification => 
      notification._id === id ? { ...notification, read: true } : notification
    ));
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

export const cleanupNotifications = () => {
  disconnectWebSocket();
  notifications.set([]);
};
