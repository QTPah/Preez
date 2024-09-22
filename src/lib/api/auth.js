import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const validateToken = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/validate-token`, {
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
    const response = await axios.post(`${API_URL}/login`, { username, password }, { withCredentials: true });
    if (response.data.success && response.data.token) {
      return response.data;
    }
    return { success: false, message: 'Login failed' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: error.response?.data?.message || 'An error occurred during login' };
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, email, password }, { withCredentials: true });
    if (response.data.success && response.data.token) {
      return response.data;
    }
    return { success: false, message: 'Registration failed' };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: error.response?.data?.message || 'An error occurred during registration' };
  }
};

export const logout = async () => {
  try {
    const response = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, message: error.response?.data?.message || 'An error occurred during logout' };
  }
};
