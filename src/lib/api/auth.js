import axios from 'axios';

const API_URL = '/api/auth';

const api = axios.create({
  baseURL: API_URL,
});

let refreshTokenRequest = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        if (!refreshTokenRequest) {
          refreshTokenRequest = api.post('/refresh-token', { refreshToken });
        }
        const { data } = await refreshTokenRequest;
        refreshTokenRequest = null;
        localStorage.setItem('authToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
  console.log('refreshError', refreshError);
        refreshTokenRequest = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('authUser');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const validateTokenAndFetchUser = async (token) => {
  try {
    const response = await api.get('/validate-token', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.data.success) {
      return { success: true, user: response.data.user, accessToken: response.data.accessToken };
    } else {
      await logout(); // Log out the user if token validation fails
      return { success: false };
    }
  } catch (error) {
    console.error('Token validation and user fetch error:', error);
    await logout(); // Log out the user if there's an error
    return { success: false, error: error.response?.data || { message: 'An error occurred during token validation and user fetch' } };
  }
};

export const login = async (username, password) => {
  try {
    const response = await api.post('/login', { username, password });
    if (response.data.success) {
      localStorage.setItem('authToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error.response?.data || { success: false, message: 'An error occurred during login' };
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await api.post('/register', { username, email, password });
    if (response.data.success) {
      localStorage.setItem('authToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error.response?.data || { success: false, message: 'An error occurred during registration' };
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/logout');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authUser');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error.response?.data || { success: false, message: 'An error occurred during logout' };
  }
};

export const updateUserSettings = async (settings) => {
  try {
    const accessToken = localStorage.getItem('authToken');
    const response = await api.put('/settings', settings, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Update settings error:', error);
    throw error.response?.data || { success: false, message: 'An error occurred while updating settings' };
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put('/change-password', { currentPassword, newPassword });
    return response.data;
  } catch (error) {
    console.error('Change password error:', error);
    throw error.response?.data || { success: false, message: 'An error occurred while changing password' };
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const accessToken = localStorage.getItem('authToken');
    const formData = new FormData();
    Object.keys(profileData).forEach(key => {
      if (key === 'profilePicture' && profileData[key] instanceof File) {
        formData.append(key, profileData[key]);
      } else {
        formData.append(key, profileData[key]);
      }
    });
    const response = await api.put('/profile', formData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error.response?.data || { success: false, message: 'An error occurred while updating profile' };
  }
};

