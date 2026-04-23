import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      updateProfile: (profile) => set((state) => ({ 
        user: { ...state.user, profile } 
      })),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
