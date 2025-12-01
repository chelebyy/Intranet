import apiClient from './apiClient';
import type { Birim, CreateBirimRequest, UpdateBirimRequest } from '../types/api/birims';

export const birimsApi = {
  getAll: async (): Promise<Birim[]> => {
    const response = await apiClient.get<any>('/birimler');
    return response.data.data;
  },

  getById: async (id: number): Promise<Birim> => {
    const response = await apiClient.get<any>(`/birimler/${id}`);
    return response.data.data;
  },

  create: async (birim: CreateBirimRequest): Promise<Birim> => {
    const response = await apiClient.post<any>('/birimler', birim);
    return response.data.data;
  },

  update: async (id: number, birim: UpdateBirimRequest): Promise<Birim> => {
    const response = await apiClient.put<any>(`/birimler/${id}`, birim);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/birimler/${id}`);
  },
};
