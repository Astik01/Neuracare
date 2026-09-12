import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { apiFetch } from '../api/client';

const STORAGE_KEY = 'neuracare_auth';
export const AuthContext = createContext(null);

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStoredAuth(auth) {
  try {
    if (auth) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // localStorage may be unavailable (private mode, disabled) - auth still
    // works for the current in-memory session, it just won't persist.
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => readStoredAuth());

  const persist = useCallback((next) => {
    setAuth(next);
    writeStoredAuth(next);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const data = await apiFetch('/auth/login', { method: 'POST', body: { email, password } });
      persist(data);
      return data.user;
    },
    [persist],
  );

  const signup = useCallback(
    async (name, email, password) => {
      const data = await apiFetch('/auth/signup', {
        method: 'POST',
        body: { name, email, password },
      });
      persist(data);
      return data.user;
    },
    [persist],
  );

  const logout = useCallback(() => persist(null), [persist]);

  const value = useMemo(
    () => ({
      user: auth?.user ?? null,
      token: auth?.token ?? null,
      isAuthenticated: Boolean(auth?.token),
      login,
      signup,
      logout,
    }),
    [auth, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
