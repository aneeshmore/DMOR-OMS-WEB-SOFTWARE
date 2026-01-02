import apiClient from '@/api/client';
import { DeliveryRecord } from './types';

export const deliveryCompleteApi = {
  getDeliveries: async (search?: string): Promise<DeliveryRecord[]> => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const response = await apiClient.get<{ success: boolean; data: DeliveryRecord[] }>(
      `/delivery-complete${query}`
    );
    return response.data.data;
  },

  markOrderDelivered: async (orderId: number): Promise<void> => {
    await apiClient.patch<{ success: boolean }>(
      `/delivery-complete/${orderId}/deliver`,
      {},
      { successMessage: 'Order marked as delivered' }
    );
  },

  returnOrder: async (orderId: number): Promise<void> => {
    await apiClient.patch<{ success: boolean }>(
      `/delivery-complete/${orderId}/return`,
      {},
      { successMessage: 'Order returned successfully' }
    );
  },

  cancelOrder: async (orderId: number): Promise<void> => {
    await apiClient.patch<{ success: boolean }>(
      `/delivery-complete/${orderId}/cancel`,
      {},
      { successMessage: 'Order cancelled successfully' }
    );
  },
};
