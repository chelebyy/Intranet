import apiClient from './apiClient';

export interface AuditLogItem {
    logID: number;
    userID: number | null;
    userName: string | null;
    birimID: number | null;
    birimName: string | null;
    action: string;
    resource: string | null;
    details: string | null;
    ipAddress: string | null;
    tarihSaat: string;
}

export interface AuditLogFilter {
    page?: number;
    pageSize?: number;
    userID?: number;
    birimID?: number;
    action?: string;
    startDate?: string;
    endDate?: string;
    searchTerm?: string;
}

export interface AuditLogPagedResponse {
    items: AuditLogItem[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export const auditLogApi = {
    getAll: async (filter: AuditLogFilter = {}): Promise<AuditLogPagedResponse> => {
        const params = new URLSearchParams();
        if (filter.page) params.append('page', filter.page.toString());
        if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());
        if (filter.userID) params.append('userID', filter.userID.toString());
        if (filter.birimID) params.append('birimID', filter.birimID.toString());
        if (filter.action) params.append('action', filter.action);
        if (filter.startDate) params.append('startDate', filter.startDate);
        if (filter.endDate) params.append('endDate', filter.endDate);
        if (filter.searchTerm) params.append('searchTerm', filter.searchTerm);

        const response = await apiClient.get<{ success: boolean; data: AuditLogPagedResponse }>(
            `/auditlog?${params.toString()}`
        );
        return response.data.data;
    },

    getById: async (id: number): Promise<AuditLogItem> => {
        const response = await apiClient.get<{ success: boolean; data: AuditLogItem }>(
            `/auditlog/${id}`
        );
        return response.data.data;
    },

    getActions: async (): Promise<string[]> => {
        const response = await apiClient.get<{ success: boolean; data: string[] }>(
            '/auditlog/actions'
        );
        return response.data.data;
    }
};
