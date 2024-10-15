import axios from 'axios';
import { auth } from '../../stores/auth';
import { get } from 'svelte/store';

const api = axios.create({
  baseURL: '/api/notifications'
});

const getAuthHeader = () => {
  const authStore = get(auth);
  return { Authorization: `Bearer ${authStore.accessToken}` };
};

export const getNotifications = async () => {
  try {
    const response = await api.get('/', {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.patch(`/${notificationId}`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const updateNotificationPreferences = async (preferences) => {
  try {
    const response = await api.put('/preferences', preferences, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    throw error;
  }
};

export const getNotificationPresets = async () => {
  try {
    const response = await api.get('/presets', {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notification presets:', error);
    throw error;
  }
};

export const createNotificationPreset = async (preset) => {
  try {
    const response = await api.post('/presets', preset, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating notification preset:', error);
    throw error;
  }
};

export const updateNotificationPreset = async (presetId, preset) => {
  try {
    const response = await api.put(`/presets/${presetId}`, preset, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error updating notification preset:', error);
    throw error;
  }
};

export const deleteNotificationPreset = async (presetId) => {
  try {
    const response = await api.delete(`/presets/${presetId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting notification preset:', error);
    throw error;
  }
};

export const getNotificationScripts = async () => {
  try {
    const response = await api.get('/scripts', {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notification scripts:', error);
    throw error;
  }
};

export const createNotificationScript = async (script) => {
  try {
    const response = await api.post('/scripts', script, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating notification script:', error);
    throw error;
  }
};

export const updateNotificationScript = async (scriptId, script) => {
  try {
    const response = await api.put(`/scripts/${scriptId}`, script, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error updating notification script:', error);
    throw error;
  }
};

export const deleteNotificationScript = async (scriptId) => {
  try {
    const response = await api.delete(`/scripts/${scriptId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting notification script:', error);
    throw error;
  }
};

export const sendManualNotification = async (notification) => {
  try {
    const response = await api.post('/send', notification, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error sending manual notification:', error);
    throw error;
  }
};

export const mutePreset = async (presetId) => {
  try {
    const response = await api.post(`/presets/${presetId}/mute`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error muting preset:', error);
    throw error;
  }
};

export const unmutePreset = async (presetId) => {
  try {
    const response = await api.post(`/presets/${presetId}/unmute`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error unmuting preset:', error);
    throw error;
  }
};
