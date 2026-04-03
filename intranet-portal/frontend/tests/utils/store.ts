import { useAuthStore } from '@/store/authStore';

export const resetAuthStore = () => {
  useAuthStore.setState({
    user: null,
    token: null,
    birimleri: [],
    selectedBirim: null,
    currentBirimInfo: null,
    currentRoleInfo: null,
    isAuthenticated: false,
  });

  localStorage.removeItem('auth-storage');
};
