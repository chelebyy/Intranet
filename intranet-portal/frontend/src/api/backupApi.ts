import { apiClient } from './apiClient';
import type { ApiResponse } from '../types';

// Backup Types
export interface BackupFile {
    fileName: string;
    sizeBytes: number;
    sizeFormatted: string;
    createdAt: string;
}

export interface BackupStats {
    lastBackupDate: string | null;
    totalSizeFormatted: string;
    backupCount: number;
    isBackupRunning: boolean;
}

export interface BackupTriggerResult {
    success: boolean;
    message: string;
    fileName?: string;
    startedAt?: string;
}

// Backup API
export const backupApi = {
    /**
     * Yedekleme istatistiklerini getirir
     */
    getStats: () =>
        apiClient.get<ApiResponse<BackupStats>>('/admin/backups/stats'),

    /**
     * Tüm yedek dosyalarını listeler
     */
    getBackups: () =>
        apiClient.get<ApiResponse<BackupFile[]>>('/admin/backups'),

    /**
     * Manuel yedekleme başlatır
     */
    triggerBackup: () =>
        apiClient.post<ApiResponse<BackupTriggerResult>>('/admin/backups/trigger'),

    /**
     * Yedek dosyasını indirir
     */
    downloadBackup: async (fileName: string) => {
        const response = await apiClient.get(`/admin/backups/${encodeURIComponent(fileName)}`, {
            responseType: 'blob'
        });

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },

    /**
     * Yedekleme loglarını getirir
     */
    getLogs: (lines: number = 50) =>
        apiClient.get<ApiResponse<string[]>>(`/admin/backups/logs?lines=${lines}`),

    /**
     * Yedek dosyasını siler
     */
    deleteBackup: (fileName: string) =>
        apiClient.delete<ApiResponse<boolean>>(`/admin/backups/${encodeURIComponent(fileName)}`)
};
