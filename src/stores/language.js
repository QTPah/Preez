import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createLanguageStore() {
  const storedLanguage = browser && localStorage.getItem('language');
  const initialLanguage = storedLanguage || 'en';
  
  const { subscribe, set } = writable(initialLanguage);

  return {
    subscribe,
    setLanguage: (lang) => {
      if (browser) {
        localStorage.setItem('language', lang);
      }
      set(lang);
    },
    toggleLanguage: () => {
      subscribe(currentLang => {
        const newLang = currentLang === 'en' ? 'de' : 'en';
        if (browser) {
          localStorage.setItem('language', newLang);
        }
        set(newLang);
      });
    }
  };
}

export const language = createLanguageStore();
