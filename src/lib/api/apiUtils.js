import axios from 'axios';
import { auth } from '../../stores/auth';
import { get } from 'svelte/store';

const refreshToken = async () => {
  const authStore = get(auth);
  try {
    const response = await axios.post('/api/auth/refresh-token', { refreshToken: authStore.refreshToken });
    auth.setSession(response.data);
    return response.data.accessToken;
  } catch (error) {
    auth.clearSession();
    throw error;
  }
};

export const apiRequest = async (axiosInstance, method, url, data = null, config = {}) => {
  let retries = 0;
  const maxRetries = 3;

  while (retries < maxRetries) {
    try {
      const authStore = get(auth);
      const headers = { ...config.headers, Authorization: `Bearer ${authStore.accessToken}` };
      const response = await axiosInstance[method](url, data, { ...config, headers });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401 && retries < maxRetries - 1) {
        await refreshToken();
        retries++;
      } else {
        throw error;
      }
    }
  }
};
