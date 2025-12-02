import { apiClient } from './apiClient';
import type { DashboardStats, RecentActivity, ApiResponse } from '../types';

export const dashboardApi = {
  /**
   * Dashboard istatistiklerini getirir
   */
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return response.data.data as DashboardStats;
  },

  /**
   * Son sistem aktivitelerini getirir
   */
  getActivities: async (count: number = 10): Promise<RecentActivity[]> => {
    const response = await apiClient.get<ApiResponse<RecentActivity[]>>('/dashboard/activities', {
      params: { count }
    });
    return response.data.data ?? [];
  }
};

export default dashboardApi;
