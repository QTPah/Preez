import { writable } from 'svelte/store';

export const isLoggedIn = writable(false);

// Initialize isLoggedIn from localStorage if available
if (typeof window !== 'undefined') {
  const storedLoginState = localStorage.getItem('isLoggedIn');
  if (storedLoginState) {
    isLoggedIn.set(JSON.parse(storedLoginState));
  }
}

// Subscribe to changes and update localStorage
isLoggedIn.subscribe(value => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('isLoggedIn', JSON.stringify(value));
  }
});
