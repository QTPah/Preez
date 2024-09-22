import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

const createAuthStore = () => {
  const { subscribe, set, update } = writable({
    token: browser ? localStorage.getItem('authToken') : null,
    user: browser ? JSON.parse(localStorage.getItem('authUser')) : null,
  });

  return {
    subscribe,
    setSession: (sessionData) => {
      if (sessionData && sessionData.token) {
        if (browser) {
          localStorage.setItem('authToken', sessionData.token);
          localStorage.setItem('authUser', JSON.stringify(sessionData.user));
        }
        set({ token: sessionData.token, user: sessionData.user });
      } else {
        if (browser) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
        }
        set({ token: null, user: null });
      }
    },
    clearSession: () => {
      if (browser) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
      set({ token: null, user: null });
    },
    updateUser: (userData) => {
      if (browser) {
        localStorage.setItem('authUser', JSON.stringify(userData));
      }
      update(state => ({ ...state, user: userData }));
    },
  };
};

export const auth = createAuthStore();
export const isLoggedIn = derived(auth, $auth => !!$auth.token);
