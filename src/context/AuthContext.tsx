import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { User } from '@/types';
import { seedData, storage, uid } from '@/lib/storage';

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  signup: (
    name: string,
    email: string,
    password: string
  ) => { ok: boolean; error?: string };
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    seedData();
    const sessionId = storage.getSession();
    if (sessionId) {
      const found = storage.getUsers().find((u) => u.id === sessionId);
      if (found) setUser(found);
    }
  }, []);

  const login = useCallback((email: string, password: string) => {
    const users = storage.getUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!found) return { ok: false, error: 'No account found with that email.' };
    if (found.password !== password)
      return { ok: false, error: 'Incorrect password. Please try again.' };
    storage.setSession(found.id);
    setUser(found);
    return { ok: true };
  }, []);

  const signup = useCallback(
    (name: string, email: string, password: string) => {
      const users = storage.getUsers();
      const exists = users.some(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (exists)
        return { ok: false, error: 'An account with that email already exists.' };
      const newUser: User = {
        id: uid('usr'),
        name: name.trim(),
        email: email.trim(),
        password,
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      storage.setUsers([...users, newUser]);
      storage.setSession(newUser.id);
      setUser(newUser);
      return { ok: true };
    },
    []
  );

  const logout = useCallback(() => {
    storage.setSession(null);
    setUser(null);
  }, []);

  const updateUser = useCallback(
    (patch: Partial<User>) => {
      if (!user) return;
      const updated = { ...user, ...patch };
      const users = storage.getUsers().map((u) =>
        u.id === user.id ? updated : u
      );
      storage.setUsers(users);
      setUser(updated);
    },
    [user]
  );

  const value = useMemo(
    () => ({ user, login, signup, logout, updateUser }),
    [user, login, signup, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
