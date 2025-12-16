import { apiClient, type ApiResponse } from './apiClient';

// --- Types ---

export interface Announcement {
  announcementID: number;
  title: string;
  content: string;
  type: 'Info' | 'Warning' | 'Critical';
  displayType: 'Banner' | 'Modal' | 'Widget';
  startDate: string;
  endDate: string;
  isActive: boolean;
  priority: number;
  createdAt: string;
  createdByName: string;
  targets: AnnouncementTarget[];
  isRead?: boolean;
}

export interface AnnouncementTarget {
  targetID: number;
  targetType: 'All' | 'Role' | 'Unit' | 'User';
  targetValue?: number;
  targetName?: string;
}

export interface CreateAnnouncementDto {
  title: string;
  content: string;
  type: string;
  displayType: string;
  startDate: string;
  endDate: string;
  priority: number;
  targets: CreateAnnouncementTargetDto[];
}

export interface CreateAnnouncementTargetDto {
  targetType: string;
  targetValue?: number;
}

// --- API Client ---

export const announcementApi = {
  // Admin Endpoints
  getAll: () => apiClient.get<ApiResponse<Announcement[]>>('/announcements/admin'),
  getById: (id: number) => apiClient.get<ApiResponse<Announcement>>(`/announcements/${id}`),
  create: (data: CreateAnnouncementDto) => apiClient.post<ApiResponse<Announcement>>('/announcements', data),
  update: (id: number, data: CreateAnnouncementDto) => apiClient.put<ApiResponse<Announcement>>(`/announcements/${id}`, data),
  delete: (id: number) => apiClient.delete<ApiResponse<boolean>>(`/announcements/${id}`),

  // User Endpoints
  getActiveForUser: () => apiClient.get<ApiResponse<Announcement[]>>('/announcements/active'),
  acknowledge: (id: number) => apiClient.post<ApiResponse<boolean>>(`/announcements/${id}/acknowledge`),
};
