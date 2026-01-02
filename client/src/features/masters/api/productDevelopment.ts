import { apiClient } from '@/api/client';

export const productDevelopmentApi = {
  create: async (data: any) => {
    const response = await apiClient.post('/product-development', data);
    return response.data;
  },
  getByMasterProductId: async (masterProductId: number) => {
    const response = await apiClient.get(`/product-development/master/${masterProductId}`);
    return response.data;
  },
  /**
   * Get mixing ratios for Base and Hardener products
   * Used for auto-add Hardener feature in Create Order
   */
  getMixingRatios: async (baseMpId: number, hardenerMpId: number) => {
    const response = await apiClient.get(`/product-development/ratios/${baseMpId}/${hardenerMpId}`);
    return response.data;
  },
};
