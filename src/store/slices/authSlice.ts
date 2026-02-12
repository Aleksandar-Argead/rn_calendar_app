import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthStatus } from '../../types';
import { User } from '../../types/User';

interface AuthState {
  user: User | null;
  status: AuthStatus;
  setUser: (user: User | null) => void;
  setStatus: (status: AuthStatus) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      status: 'idle',
      setUser: user =>
        set({ user, status: user ? 'authenticated' : 'unauthenticated' }),
      setStatus: status => set({ status }),
      logout: () => set({ user: null, status: 'unauthenticated' }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage), // on mobile it uses AsyncStorage automatically
    },
  ),
);
