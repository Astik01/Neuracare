import { useEffect, useState } from 'react';

const STORAGE_KEY = 'neuracare_dark_mode';

function readStoredPreference() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => readStoredPreference());

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem(STORAGE_KEY, String(isDark));
    } catch {
      // localStorage may be unavailable - preference just won't persist.
    }
  }, [isDark]);

  return [isDark, () => setIsDark((current) => !current)];
}
