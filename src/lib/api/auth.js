import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const validateTokenAndFetchUser = async (token) => {
  try {
    const response = await api.get('/validate-token', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.data.success) {
      return { success: true, user: response.data.user, token: response.data.token };
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
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error.response?.data || { success: false, message: 'An error occurred during login' };
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await api.post('/register', { username, email, password });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error.response?.data || { success: false, message: 'An error occurred during registration' };
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/logout');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error.response?.data || { success: false, message: 'An error occurred during logout' };
  }
};

