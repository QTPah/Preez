import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { auth } from './auth';

function createThemeStore() {
  const { subscribe, set } = writable(browser && localStorage.getItem('theme') || 'light');

  auth.subscribe(($auth) => {
    if ($auth.user && $auth.user.settings) {
      const theme = $auth.user.settings.darkMode ? 'dark' : 'light';
      set(theme);
      if (browser) {
        localStorage.setItem('theme', theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
      }
    }
  });

  return {
    subscribe,
    toggleTheme: () => {
      auth.toggleDarkMode();
    }
  };
}

export const theme = createThemeStore();
