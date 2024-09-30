import { writable, derived, get } from 'svelte/store';
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

    if (storedAccessToken && storedRefreshToken && storedUser) {
      set({
        accessToken: storedAccessToken,
        refreshToken: storedRefreshToken,
        user: JSON.parse(storedUser),
      });
    }
  }

  return {
    subscribe,
    setSession: (sessionData) => {
      update(state => {
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
          return initialState;
        }
      });
    },
    clearSession: () => {
      if (browser) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('authUser');
      }
      set(initialState);
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
    getUserSettings: async () => {
      const { accessToken } = get(auth);
      const response = await fetch('/api/auth/settings', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user settings');
      }
      return response.json();
    },
    toggleDarkMode: () => {
      update(state => {
        const newDarkMode = !state.user.settings.darkMode;
        const newUser = {
          ...state.user,
          settings: {
            ...state.user.settings,
            darkMode: newDarkMode
          }
        };
        if (browser) {
          localStorage.setItem('authUser', JSON.stringify(newUser));
        }
        return { ...state, user: newUser };
      });
    }
  };
};

export const auth = createAuthStore();
export const isLoggedIn = derived(auth, $auth => !!$auth.accessToken);
