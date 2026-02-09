// Storage keys constants
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

// Storage utility functions
export const storage = {
  // Get item from localStorage
  get: (key: StorageKey): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading from localStorage: ${error}`);
      return null;
    }
  },

  // Set item in localStorage
  set: (key: StorageKey, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error writing to localStorage: ${error}`);
    }
  },

  // Remove item from localStorage
  remove: (key: StorageKey): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage: ${error}`);
    }
  },

  // Clear all items from localStorage
  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.clear();
    } catch (error) {
      console.error(`Error clearing localStorage: ${error}`);
    }
  },

  // Get parsed JSON from localStorage
  getJSON: <T>(key: StorageKey): T | null => {
    const item = storage.get(key);
    if (!item) return null;
    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error parsing JSON from localStorage: ${error}`);
      return null;
    }
  },

  // Set JSON in localStorage
  setJSON: <T>(key: StorageKey, value: T): void => {
    try {
      storage.set(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error stringifying JSON for localStorage: ${error}`);
    }
  },
};
