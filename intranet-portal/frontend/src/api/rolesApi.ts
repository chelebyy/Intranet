import apiClient from './apiClient';
import type { Role, CreateRoleRequest, UpdateRoleRequest, Permission, AssignPermissionsRequest } from '../types/api/roles';

export const rolesApi = {
  getAll: async (): Promise<Role[]> => {
    const response = await apiClient.get<any>('/roles');
    return response.data.data;
  },

  getById: async (id: number): Promise<Role> => {
    const response = await apiClient.get<any>(`/roles/${id}`);
    return response.data.data;
  },

  create: async (role: CreateRoleRequest): Promise<Role> => {
    const response = await apiClient.post<any>('/roles', role);
    return response.data.data;
  },

  update: async (id: number, role: UpdateRoleRequest): Promise<Role> => {
    const response = await apiClient.put<any>(`/roles/${id}`, role);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/roles/${id}`);
  },

  getPermissions: async (roleId: number): Promise<Permission[]> => {
    const response = await apiClient.get<any>(`/roles/${roleId}/permissions`);
    return response.data.data;
  },

  updatePermissions: async (roleId: number, request: AssignPermissionsRequest): Promise<void> => {
    await apiClient.post(`/roles/${roleId}/permissions`, request);
  },
};

export const permissionsApi = {
  getAll: async (): Promise<Permission[]> => {
    const response = await apiClient.get<any>('/permissions');
    return response.data.data;
  },
};
