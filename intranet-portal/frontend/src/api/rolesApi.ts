import apiClient from './apiClient';
import type { Role, CreateRoleRequest, UpdateRoleRequest, Permission, AssignPermissionsRequest } from '../types/api/roles';

export const rolesApi = {
  getAll: async (): Promise<Role[]> => {
    const response = await apiClient.get<Role[]>('/roles');
    return response.data;
  },

  getById: async (id: number): Promise<Role> => {
    const response = await apiClient.get<Role>(`/roles/${id}`);
    return response.data;
  },

  create: async (role: CreateRoleRequest): Promise<Role> => {
    const response = await apiClient.post<Role>('/roles', role);
    return response.data;
  },

  update: async (id: number, role: UpdateRoleRequest): Promise<Role> => {
    const response = await apiClient.put<Role>(`/roles/${id}`, role);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/roles/${id}`);
  },

  getPermissions: async (roleId: number): Promise<Permission[]> => {
    const response = await apiClient.get<Permission[]>(`/roles/${roleId}/permissions`);
    return response.data;
  },

  updatePermissions: async (roleId: number, request: AssignPermissionsRequest): Promise<void> => {
    await apiClient.post(`/roles/${roleId}/permissions`, request);
  },
};

export const permissionsApi = {
  getAll: async (): Promise<Permission[]> => {
    const response = await apiClient.get<Permission[]>('/permissions');
    return response.data;
  },
};
