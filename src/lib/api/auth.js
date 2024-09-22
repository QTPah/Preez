import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const validateToken = async (token) => {
  try {
    const response = await api.get('/validate-token', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.success;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
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

export const fetchUserData = async (token) => {
  try {
    const response = await api.get('/user', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.user;
  } catch (error) {
    console.error('Fetch user data error:', error);
    throw error.response?.data || { success: false, message: 'An error occurred while fetching user data' };
  }
};
