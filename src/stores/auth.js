import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

const createAuthStore = () => {
  const { subscribe, set, update } = writable({
    accessToken: browser ? localStorage.getItem('authToken') : null,
    refreshToken: browser ? localStorage.getItem('refreshToken') : null,
    user: browser ? JSON.parse(localStorage.getItem('authUser')) : null,
  });

  return {
    subscribe,
    setSession: (sessionData) => {
      if (sessionData && sessionData.accessToken) {
        if (browser) {
          localStorage.setItem('authToken', sessionData.accessToken);
          localStorage.setItem('refreshToken', sessionData.refreshToken);
          localStorage.setItem('authUser', JSON.stringify(sessionData.user));
        }
        set({ accessToken: sessionData.accessToken, refreshToken: sessionData.refreshToken, user: sessionData.user });
      } else {
        if (browser) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('authUser');
        }
        set({ accessToken: null, refreshToken: null, user: null });
      }
    },
    clearSession: () => {
      if (browser) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('authUser');
      }
      set({ accessToken: null, refreshToken: null, user: null });
    },
    updateUser: (userData) => {
      if (browser) {
        localStorage.setItem('authUser', JSON.stringify(userData));
      }
      update(state => ({ ...state, user: userData }));
    },
    updateTokens: (accessToken, refreshToken) => {
      if (browser) {
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
      }
      update(state => ({ ...state, accessToken, refreshToken }));
    },
  };
};

export const auth = createAuthStore();
export const isLoggedIn = derived(auth, $auth => !!$auth.accessToken);
