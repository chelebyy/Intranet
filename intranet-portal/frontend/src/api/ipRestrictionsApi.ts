import apiClient from './apiClient';

export interface IPRestriction {
    id: number;
    ipAddress: string;
    description: string | null;
    type: 'Whitelist' | 'Blacklist';
    isActive: boolean;
    createdAt: string;
    createdBy: number | null;
}

export interface CreateIPRestrictionDto {
    ipAddress: string;
    description?: string;
    type: 'Whitelist' | 'Blacklist';
}

export interface UpdateIPRestrictionDto {
    description?: string;
    isActive?: boolean;
}

export const ipRestrictionsApi = {
    getAll: async (): Promise<IPRestriction[]> => {
        const response = await apiClient.get<{ success: boolean; data: IPRestriction[] }>('/iprestrictions');
        return response.data.data;
    },

    getById: async (id: number): Promise<IPRestriction> => {
        const response = await apiClient.get<{ success: boolean; data: IPRestriction }>(`/iprestrictions/${id}`);
        return response.data.data;
    },

    create: async (dto: CreateIPRestrictionDto): Promise<IPRestriction> => {
        const response = await apiClient.post<{ success: boolean; data: IPRestriction }>('/iprestrictions', dto);
        return response.data.data;
    },

    update: async (id: number, dto: UpdateIPRestrictionDto): Promise<IPRestriction> => {
        const response = await apiClient.put<{ success: boolean; data: IPRestriction }>(`/iprestrictions/${id}`, dto);
        return response.data.data;
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/iprestrictions/${id}`);
    },

    checkIP: async (ip: string): Promise<{ ip: string; isAllowed: boolean }> => {
        const response = await apiClient.get<{ success: boolean; data: { ip: string; isAllowed: boolean } }>(`/iprestrictions/check/${ip}`);
        return response.data.data;
    }
};
