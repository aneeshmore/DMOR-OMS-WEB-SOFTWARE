import apiClient from '../../../api/client';
import { ProductionBatch, CreateProductionBatchInput, UpdateProductionBatchInput } from '../types';

export const productionApi = {
  getAllBatches: async (filters?: { status?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);

    const response = await apiClient.get<{ success: boolean; data: ProductionBatch[] }>(
      `/production-batches/batches?${params.toString()}`
    );
    return response.data.data;
  },

  getBatchById: async (batchId: string) => {
    const response = await apiClient.get<{ success: boolean; data: ProductionBatch }>(
      `/production-batches/batches/${batchId}`
    );
    return response.data.data;
  },

  createBatch: async (batchData: CreateProductionBatchInput) => {
    const response = await apiClient.post<{ success: boolean; data: ProductionBatch }>(
      '/production-batches/batches',
      batchData
    );
    return response.data.data;
  },

  updateBatch: async (batchId: string, updateData: UpdateProductionBatchInput) => {
    const response = await apiClient.put<{ success: boolean; data: ProductionBatch }>(
      `/production-batches/batches/${batchId}`,
      updateData
    );
    return response.data.data;
  },

  deleteBatch: async (batchId: string) => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `/production-batches/batches/${batchId}`
    );
    return response.data;
  },

  completeBatch: async (batchId: string, actualProductionQty: number) => {
    const response = await apiClient.post<{
      success: boolean;
      data: ProductionBatch;
      message: string;
    }>(`/production-batches/batches/${batchId}/complete`, { actualProductionQty });
    return response.data;
  },
};
