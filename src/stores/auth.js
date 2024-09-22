import { writable } from 'svelte/store';

export const token = writable(localStorage.getItem('token') || null);
export const user = writable(JSON.parse(localStorage.getItem('user')) || null);

token.subscribe(value => {
  if (typeof window !== 'undefined') {
    if (value) {
      localStorage.setItem('token', value);
    } else {
      localStorage.removeItem('token');
    }
  }
});

user.subscribe(value => {
  if (typeof window !== 'undefined') {
    if (value) {
      localStorage.setItem('user', JSON.stringify(value));
    } else {
      localStorage.removeItem('user');
    }
  }
});

export const isLoggedIn = writable(!!localStorage.getItem('token'));

isLoggedIn.subscribe(value => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('isLoggedIn', JSON.stringify(value));
  }
});
