import apiClient from './apiClient';
import type { Unvan, CreateUnvanRequest, UpdateUnvanRequest } from '../types/api/unvans';

export const unvansApi = {
  getAll: async (): Promise<Unvan[]> => {
    const response = await apiClient.get<any>('/unvanlar');
    return response.data.data;
  },

  getById: async (id: number): Promise<Unvan> => {
    const response = await apiClient.get<any>(`/unvanlar/${id}`);
    return response.data.data;
  },

  create: async (unvan: CreateUnvanRequest): Promise<Unvan> => {
    const response = await apiClient.post<any>('/unvanlar', unvan);
    return response.data.data;
  },

  update: async (id: number, unvan: UpdateUnvanRequest): Promise<Unvan> => {
    const response = await apiClient.put<any>(`/unvanlar/${id}`, unvan);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/unvanlar/${id}`);
  },
};
