import apiClient from './apiClient';
import type { UserDto, CreateUserRequest, UpdateUserRequest } from '../types/api/users';

export const usersApi = {
    getAll: async (): Promise<UserDto[]> => {
        const response = await apiClient.get<any>('/users');
        return response.data.data;
    },

    getById: async (id: number): Promise<UserDto> => {
        const response = await apiClient.get<any>(`/users/${id}`);
        return response.data.data;
    },

    create: async (user: CreateUserRequest): Promise<UserDto> => {
        const response = await apiClient.post<any>('/users', user);
        return response.data.data;
    },

    update: async (id: number, user: UpdateUserRequest): Promise<UserDto> => {
        const response = await apiClient.put<any>(`/users/${id}`, user);
        return response.data.data;
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/users/${id}`);
    },

    resetPassword: async (id: number, newPassword: string): Promise<void> => {
        await apiClient.post(`/users/${id}/reset-password`, { newPassword });
    }
};
