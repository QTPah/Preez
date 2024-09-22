import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

const createAuthStore = () => {
  const { subscribe, set, update } = writable({
    token: browser ? localStorage.getItem('authToken') : null,
    user: null,
  });

  return {
    subscribe,
    setSession: (sessionData) => {
      if (sessionData && sessionData.token) {
        if (browser) localStorage.setItem('authToken', sessionData.token);
        set({ token: sessionData.token, user: sessionData.user });
      } else {
        if (browser) localStorage.removeItem('authToken');
        set({ token: null, user: null });
      }
    },
    clearSession: () => {
      if (browser) localStorage.removeItem('authToken');
      set({ token: null, user: null });
    },
    updateUser: (userData) => update(state => ({ ...state, user: userData })),
  };
};

export const auth = createAuthStore();
export const isLoggedIn = derived(auth, $auth => !!$auth.token);
