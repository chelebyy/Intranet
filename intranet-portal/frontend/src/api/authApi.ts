import { apiClient } from './apiClient';
import type { ApiResponse, LoginCredentials, User, UserBirimRole } from '../types';

interface LoginResponse {
  user: User;
  birimler: UserBirimRole[];
  selectedBirim: any; // BirimDto from backend
  selectedRole: any; // RoleDto from backend
  requiresBirimSelection: boolean;
}

export const authApi = {
  // Login endpoint
  login: async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> => {
    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'LOGIN_FAILED',
          message: error.response?.data?.message || 'Login failed',
          details: error.response?.data?.error?.details || [],
        },
      };
    }
  },

  // Logout endpoint
  logout: async (): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.post<ApiResponse<void>>('/auth/logout');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'LOGOUT_FAILED',
          message: error.response?.data?.message || 'Logout failed',
        },
      };
    }
  },

  // Verify token (check if user is still authenticated)
  verifyToken: async (): Promise<ApiResponse<LoginResponse>> => {
    try {
      const response = await apiClient.get<ApiResponse<LoginResponse>>('/auth/verify');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'TOKEN_INVALID',
          message: error.response?.data?.message || 'Token verification failed',
        },
      };
    }
  },

  // Refresh token (if refresh token mechanism is implemented)
  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    try {
      const response = await apiClient.post<ApiResponse<{ token: string }>>('/auth/refresh');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'REFRESH_FAILED',
          message: error.response?.data?.message || 'Token refresh failed',
        },
      };
    }
  },

  // Select birim for multi-birim users
  selectBirim: async (birimId: number): Promise<ApiResponse<LoginResponse>> => {
    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/select-birim', { birimId });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'SELECT_BIRIM_FAILED',
          message: error.response?.data?.error?.message || 'Birim seçimi başarısız',
        },
      };
    }
  },

  // Get current user info
  getCurrentUser: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/auth/me');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'GET_USER_FAILED',
          message: error.response?.data?.error?.message || 'Kullanıcı bilgisi alınamadı',
        },
      };
    }
  },
};
