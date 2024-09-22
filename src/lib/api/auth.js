import { isLoggedIn } from '../../stores/auth';

// Simulated API delay
const apiDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const login = async (username, password) => {
  await apiDelay(1000); // Simulate API call
  
  // In a real app, you'd validate credentials with a backend
  if (username === 'demo' && password === 'password') {
    isLoggedIn.set(true);
    return { success: true, message: 'Logged in successfully' };
  } else {
    return { success: false, message: 'Invalid credentials' };
  }
};

export const register = async (username, email, password) => {
  await apiDelay(1000); // Simulate API call
  
  // In a real app, you'd send this data to a backend
  if (username && email && password) {
    isLoggedIn.set(true);
    return { success: true, message: 'Registered successfully' };
  } else {
    return { success: false, message: 'Invalid registration data' };
  }
};

export const logout = async () => {
  await apiDelay(500); // Simulate API call
  
  isLoggedIn.set(false);
  return { success: true, message: 'Logged out successfully' };
};
