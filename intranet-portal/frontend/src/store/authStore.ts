import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, LoginCredentials, UserBirimRole } from '../types';
import { authApi } from '../api/authApi';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      birimleri: [],
      selectedBirim: null,
      isAuthenticated: false,

      login: async (credentials: LoginCredentials) => {
        try {
          const response = await authApi.login(credentials);

          if (response.success && response.data) {
            // Backend returns: { user, birimler, selectedBirim, selectedRole, requiresBirimSelection }
            // Note: Token is in HttpOnly cookie, not in response
            const { user, birimler, selectedBirim } = response.data;

            set({
              user,
              token: null, // Token is in HttpOnly cookie
              birimleri: birimler || [],
              isAuthenticated: true,
              // Use selectedBirim from backend if available
              selectedBirim: selectedBirim || null,
            });
          } else {
            throw new Error(response.message || 'Login failed');
          }
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      },

      selectBirim: (birim: UserBirimRole) => {
        set({ selectedBirim: birim });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          birimleri: [],
          selectedBirim: null,
          isAuthenticated: false,
        });

        // Clear HttpOnly cookie (will be handled by backend on logout endpoint call)
        authApi.logout().catch(console.error);
      },
    }),
    {
      name: 'auth-storage',
      // Only persist non-sensitive data
      partialize: (state) => ({
        user: state.user,
        birimleri: state.birimleri,
        selectedBirim: state.selectedBirim,
        isAuthenticated: state.isAuthenticated,
        // Don't persist token in localStorage (will use HttpOnly cookie)
      }),
    }
  )
);
