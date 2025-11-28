import apiClient from './apiClient';
import type { Birim, CreateBirimRequest, UpdateBirimRequest } from '../types/api/birims';

export const birimsApi = {
  getAll: async (): Promise<Birim[]> => {
    const response = await apiClient.get<Birim[]>('/birimler');
    return response.data;
  },

  getById: async (id: number): Promise<Birim> => {
    const response = await apiClient.get<Birim>(`/birimler/${id}`);
    return response.data;
  },

  create: async (birim: CreateBirimRequest): Promise<Birim> => {
    const response = await apiClient.post<Birim>('/birimler', birim);
    return response.data;
  },

  update: async (id: number, birim: UpdateBirimRequest): Promise<Birim> => {
    const response = await apiClient.put<Birim>(`/birimler/${id}`, birim);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/birimler/${id}`);
  },
};
