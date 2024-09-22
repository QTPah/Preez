import { writable } from 'svelte/store';
import { validateToken } from '../lib/api/auth';

export const token = writable(null);
export const user = writable(null);
export const isLoggedIn = writable(false);

export function setSession(sessionData) {
  if (sessionData && sessionData.token) {
    token.set(sessionData.token);
    user.set(sessionData.user);
    isLoggedIn.set(true);
    // Optionally, you can store the token in localStorage for persistence
    localStorage.setItem('authToken', sessionData.token);
  } else {
    token.set(null);
    user.set(null);
    isLoggedIn.set(false);
    localStorage.removeItem('authToken');
  }
}

export async function checkAuthStatus() {
  const storedToken = localStorage.getItem('authToken');
  if (storedToken) {
    const isValid = await validateToken(storedToken);
    if (isValid) {
      token.set(storedToken);
      isLoggedIn.set(true);
      // Fetch user data
      const userData = await fetchUserData(storedToken);
      if (userData) {
        user.set(userData);
      } else {
        setSession(null); // Clear the session if user data couldn't be fetched
      }
    } else {
      setSession(null); // Clear the invalid session
    }
  }
}
