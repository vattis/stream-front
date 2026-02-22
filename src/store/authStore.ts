import { create } from 'zustand';
import { CurrentUser } from '../types';
import { authApi } from '../api/auth';

interface AuthState {
  user: CurrentUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: CurrentUser | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    await authApi.login({ email, password });
    const user = await authApi.getCurrentUser();
    set({ user, isAuthenticated: !!user });
  },

  logout: async () => {
    await authApi.logout();
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const user = await authApi.getCurrentUser();
      set({ user, isAuthenticated: !!user, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user: CurrentUser | null) => {
    set({ user, isAuthenticated: !!user });
  },
}));
