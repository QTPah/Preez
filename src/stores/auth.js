import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

const initialState = {
  accessToken: null,
  refreshToken: null,
  user: null,
};

const createAuthStore = () => {
  const { subscribe, set, update } = writable(initialState);

  if (browser) {
    const storedAccessToken = localStorage.getItem('authToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedUser = localStorage.getItem('authUser');

    console.log('Initial load - Stored tokens:', { storedAccessToken, storedRefreshToken });
    console.log('Initial load - Stored user:', storedUser);

    if (storedAccessToken && storedRefreshToken && storedUser) {
      set({
        accessToken: storedAccessToken,
        refreshToken: storedRefreshToken,
        user: JSON.parse(storedUser),
      });
      console.log('Initial load - Session restored from localStorage');
    } else {
      console.log('Initial load - No stored session found');
    }
  }

  return {
    subscribe,
    setSession: (sessionData) => {
      console.log('setSession called with:', sessionData);
      update(state => {
        if (sessionData && sessionData.accessToken) {
          if (browser) {
            localStorage.setItem('authToken', sessionData.accessToken);
            localStorage.setItem('refreshToken', sessionData.refreshToken);
            localStorage.setItem('authUser', JSON.stringify(sessionData.user));
            console.log('Session data saved to localStorage');
          }
          console.log('New session state:', { accessToken: sessionData.accessToken, refreshToken: sessionData.refreshToken, user: sessionData.user });
          return { accessToken: sessionData.accessToken, refreshToken: sessionData.refreshToken, user: sessionData.user };
        } else {
          console.log('Clearing session data');
          if (browser) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('authUser');
          }
          return initialState;
        }
      });
    },
    clearSession: () => {
      console.log('clearSession called');
      if (browser) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('authUser');
        console.log('Session data removed from localStorage');
      }
      set(initialState);
      console.log('Session state reset to initial state');
    },
    updateUser: (userData) => {
      update(state => {
        if (browser) {
          localStorage.setItem('authUser', JSON.stringify(userData));
        }
        return { ...state, user: userData };
      });
    },
    updateTokens: (accessToken, refreshToken) => {
      update(state => {
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
