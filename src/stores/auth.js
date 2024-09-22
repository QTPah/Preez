import { writable } from 'svelte/store';

export const token = writable(null);
export const user = writable(null);
export const isLoggedIn = writable(false);

export function setSession(sessionData) {
  if (sessionData) {
    token.set(sessionData.token);
    user.set(sessionData.user);
    isLoggedIn.set(true);
  } else {
    token.set(null);
    user.set(null);
    isLoggedIn.set(false);
  }
}
