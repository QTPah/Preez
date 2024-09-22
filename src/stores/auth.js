import { writable } from 'svelte/store';

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
