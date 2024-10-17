import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { getNotifications, markNotificationAsRead, connectWebSocket, disconnectWebSocket } from '$lib/api/notifications';

function createNotificationsStore() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    initialize: async (token) => {
      try {
        const response = await getNotifications();
        set(response);
        if (browser) {
          connectWebSocket(token);
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    },
    add: (notification) => {
      update(n => [notification, ...n]);
    },
    markAsRead: async (id) => {
      try {
        await markNotificationAsRead(id);
        update(n => n.map(notification => 
          notification._id === id ? { ...notification, read: true } : notification
        ));
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    },
    cleanup: () => {
      if (browser) {
        disconnectWebSocket();
      }
      set([]);
    }
  };
}

export const notifications = createNotificationsStore();
