// authStore.ts — Zustand auth state
// Role: 'doctor' | 'admin' | 'patient'

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'doctor' | 'admin' | 'patient';
export const UserRoleValues = ['doctor', 'admin', 'patient'] as const;

export interface User {
  id: string;
  name: string;
  role: UserRole;
  clinic?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      setUser: (user) => set({ user }),
    }),
    { name: 'scriptiq-auth' }
  )
);
