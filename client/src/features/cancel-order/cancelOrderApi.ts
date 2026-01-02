import { apiClient } from '@/api/client';
import { CancelOrderRecord, CancelOrderPayload } from './types';

export const cancelOrderApi = {
  /**
   * Get all cancellable orders (orders that can still be cancelled)
   */
  getCancellableOrders: async (search?: string): Promise<CancelOrderRecord[]> => {
    const params = search ? { search } : {};
    const response = await apiClient.get('/cancel-order/cancellable', { params });
    return response.data.data;
  },

  /**
   * Get all cancelled orders
   */
  getCancelledOrders: async (search?: string): Promise<CancelOrderRecord[]> => {
    const params = search ? { search } : {};
    const response = await apiClient.get('/cancel-order/cancelled', { params });
    return response.data.data;
  },

  /**
   * Cancel an order with a reason
   */
  cancelOrder: async (payload: CancelOrderPayload): Promise<void> => {
    await apiClient.patch(
      `/cancel-order/${payload.orderId}/cancel`,
      {
        reason: payload.reason,
      },
      {
        successMessage: 'Order cancelled successfully',
      }
    );
  },

  /**
   * Get cancel order statistics
   */
  getStats: async (): Promise<{
    totalCancellable: number;
    totalCancelled: number;
    cancelledToday: number;
    cancelledThisMonth: number;
  }> => {
    const response = await apiClient.get('/cancel-order/stats');
    return response.data.data;
  },
};
