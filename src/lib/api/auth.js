import axios from 'axios';
import { token, user, isLoggedIn } from '../../stores/auth';

const API_URL = 'http://localhost:5000/api/auth';

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    if (response.data.success) {
      token.set(response.data.token);
      user.set(response.data.user);
      isLoggedIn.set(true);
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: error.response?.data?.message || 'An error occurred during login' };
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, email, password });
    if (response.data.success) {
      token.set(response.data.token);
      user.set(response.data.user);
      isLoggedIn.set(true);
    }
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: error.response?.data?.message || 'An error occurred during registration' };
  }
};

export const logout = async () => {
  try {
    const response = await axios.post(`${API_URL}/logout`);
    if (response.data.success) {
      token.set(null);
      user.set(null);
      isLoggedIn.set(false);
    }
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, message: error.response?.data?.message || 'An error occurred during logout' };
  }
};
