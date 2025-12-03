import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, LoginCredentials, UserBirimRole, SelectedBirimInfo, SelectedRoleInfo } from '../types';
import { authApi } from '../api/authApi';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      birimleri: [],
      selectedBirim: null,
      currentBirimInfo: null,
      currentRoleInfo: null,
      isAuthenticated: false,

      login: async (credentials: LoginCredentials) => {
        try {
          const response = await authApi.login(credentials);

          if (response.success && response.data) {
            // Backend returns: { user, birimler, selectedBirim, selectedRole, requiresBirimSelection }
            // Note: Token is in HttpOnly cookie, not in response
            const { user, birimler, selectedBirim, selectedRole } = response.data;

            // Map backend birimler structure to frontend UserBirimRole structure
            // Backend: { birim: { birimID, birimAdi }, role: { roleID, roleName } }
            // Frontend: { birimId, birimAdi, roleId, roleName }
            const mappedBirimler = (birimler || []).map((item: any) => ({
              birimId: item.birim?.birimID || item.birimId,
              birimAdi: item.birim?.birimAdi || item.birimAdi,
              roleId: item.role?.roleID || item.roleId,
              roleName: item.role?.roleName || item.roleName,
            }));

            set({
              user,
              token: null, // Token is in HttpOnly cookie
              birimleri: mappedBirimler,
              isAuthenticated: true,
              // Use selectedBirim from backend if available
              selectedBirim: selectedBirim || null,
              currentBirimInfo: selectedBirim ? { birimId: selectedBirim.birimID || selectedBirim.birimId, birimAdi: selectedBirim.birimAdi } : null,
              currentRoleInfo: selectedRole ? { roleId: selectedRole.roleID || selectedRole.roleId, roleName: selectedRole.roleName } : null,
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
        set({ 
          selectedBirim: birim,
          currentBirimInfo: { birimId: birim.birimId, birimAdi: birim.birimAdi },
          currentRoleInfo: { roleId: birim.roleId, roleName: birim.roleName },
        });
      },

      setSelectedBirimRole: (birim: SelectedBirimInfo, role: SelectedRoleInfo) => {
        set({
          currentBirimInfo: birim,
          currentRoleInfo: role,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          birimleri: [],
          selectedBirim: null,
          currentBirimInfo: null,
          currentRoleInfo: null,
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
        currentBirimInfo: state.currentBirimInfo,
        currentRoleInfo: state.currentRoleInfo,
        isAuthenticated: state.isAuthenticated,
        // Don't persist token in localStorage (will use HttpOnly cookie)
      }),
    }
  )
);
