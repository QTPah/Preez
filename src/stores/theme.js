import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createThemeStore() {
  const storedTheme = browser && localStorage.getItem('theme');
  const initialTheme = storedTheme || 'light';
  
  if (browser) {
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }

  const { subscribe, set, update } = writable(initialTheme);

  return {
    subscribe,
    toggleTheme: () => {
      update(currentTheme => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        if (browser) {
          localStorage.setItem('theme', newTheme);
          document.documentElement.classList.toggle('dark', newTheme === 'dark');
        }
        return newTheme;
      });
    },
    setTheme: (newTheme) => {
      set(newTheme);
      if (browser) {
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      }
    }
  };
}

export const theme = createThemeStore();
