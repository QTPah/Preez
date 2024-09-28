import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

const createAuthStore = () => {
  const store = writable({
    accessToken: browser ? localStorage.getItem('authToken') : null,
    refreshToken: browser ? localStorage.getItem('refreshToken') : null,
    user: browser ? JSON.parse(localStorage.getItem('authUser')) : null,
  });

  return {
    subscribe: store.subscribe,
    setSession: (sessionData) => {
      store.update(state => {
        if (sessionData && sessionData.accessToken) {
          if (browser) {
            localStorage.setItem('authToken', sessionData.accessToken);
            localStorage.setItem('refreshToken', sessionData.refreshToken);
            localStorage.setItem('authUser', JSON.stringify(sessionData.user));
          }
          return { accessToken: sessionData.accessToken, refreshToken: sessionData.refreshToken, user: sessionData.user };
        } else {
          if (browser) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('authUser');
          }
          return { accessToken: null, refreshToken: null, user: null };
        }
      });
    },
    clearSession: () => {
console.log('clearSession');
      store.update(state => {
        if (browser) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('authUser');
        }
        return { accessToken: null, refreshToken: null, user: null };
      });
    },
    updateUser: (userData) => {
      store.update(state => {
        if (browser) {
          localStorage.setItem('authUser', JSON.stringify(userData));
        }
        return { ...state, user: userData };
      });
    },
    updateTokens: (accessToken, refreshToken) => {
      store.update(state => {
        if (browser) {
          localStorage.setItem('authToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
        }
        return { ...state, accessToken, refreshToken };
      });
    },
  };
};

export const auth = createAuthStore();
export const isLoggedIn = derived(auth, $auth => !!$auth.accessToken);
