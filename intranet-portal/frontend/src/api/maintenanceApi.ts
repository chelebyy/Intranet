import { apiClient } from './apiClient';
import type { ApiResponse } from '../types';

// DTO Types
export interface MaintenanceStatusDto {
    isMaintenanceActive: boolean;
    isManualMaintenanceEnabled: boolean;
    maintenanceMessage: string | null;
    scheduledMaintenanceTime?: string;
    scheduledMaintenanceMessage?: string;
}

export interface MaintenanceStats {
    databaseName: string;
    databaseSize: string;
    totalTables: number;
    totalIndexes: number;
    totalDeadTuples: number;
    totalLiveTuples: number;
    lastMaintenanceDate: string | null;
    activeConnections: number;
    isMaintenanceRunning: boolean;
    isManualMaintenanceEnabled: boolean;
    maintenanceMessage: string | null;
    scheduledMaintenanceTime?: string;
    scheduledMaintenanceMessage?: string;
}

export interface TableStats {
    schemaName: string;
    tableName: string;
    tableSize: string;
    indexSize: string;
    liveTuples: number;
    deadTuples: number;
    lastVacuum: string | null;
    lastAutoVacuum: string | null;
    lastAnalyze: string | null;
    lastAutoAnalyze: string | null;
    deadTuplePercentage: number;
    needsMaintenance: boolean;
}

export interface MaintenanceResult {
    success: boolean;
    message: string;
    operationType: number;
    tableName: string | null;
    durationMs: number;
    startedAt: string;
    completedAt: string | null;
}

export interface MaintenanceRequest {
    tableName?: string;
}

export interface ToggleMaintenanceRequest {
    enabled: boolean;
    message?: string;
}

// Maintenance API
export const maintenanceApi = {
    /**
     * Bakım modu durumunu ve planını getirir (Hafif)
     */
    getStatus: () =>
        apiClient.get<ApiResponse<MaintenanceStatusDto>>('/admin/maintenance/status'),

    /**
     * Veritabanı genel istatistiklerini getirir
     */
    getStats: () =>
        apiClient.get<ApiResponse<MaintenanceStats>>('/admin/maintenance/stats'),

    /**
     * Tüm tabloların istatistiklerini getirir
     */
    getTableStats: () =>
        apiClient.get<ApiResponse<TableStats[]>>('/admin/maintenance/tables'),

    /**
     * VACUUM işlemi çalıştırır
     */
    runVacuum: (tableName?: string) =>
        apiClient.post<ApiResponse<MaintenanceResult>>('/admin/maintenance/vacuum', { tableName }),

    /**
     * VACUUM FULL işlemi çalıştırır
     */
    runVacuumFull: (tableName?: string) =>
        apiClient.post<ApiResponse<MaintenanceResult>>('/admin/maintenance/vacuum-full', { tableName }),

    /**
     * ANALYZE işlemi çalıştırır
     */
    runAnalyze: (tableName?: string) =>
        apiClient.post<ApiResponse<MaintenanceResult>>('/admin/maintenance/analyze', { tableName }),

    /**
     * REINDEX işlemi çalıştırır
     */
    runReindex: (tableName?: string) =>
        apiClient.post<ApiResponse<MaintenanceResult>>('/admin/maintenance/reindex', { tableName }),

    /**
     * Bakım modunu açar/kapatır
     */
    toggleMaintenanceMode: (enabled: boolean, message?: string) =>
        apiClient.post<ApiResponse<boolean>>('/admin/maintenance/mode', { enabled, message }),

    /**
     * Bakım planlar veya iptal eder
     */
    scheduleMaintenance: (scheduledTime: string | null, message?: string, cancelSchedule?: boolean) =>
        apiClient.post<ApiResponse<boolean>>('/admin/maintenance/schedule', { scheduledTime, message, cancelSchedule })
};

export default maintenanceApi;
