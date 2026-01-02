import apiClient from '../../../api/client';
import { Order, OrderWithDetails, CreateOrderInput, UpdateOrderInput } from '../types';

export const ordersApi = {
  getAll: async (
    arg1?: number | { limit?: number; offset?: number; status?: string },
    arg2?: number
  ) => {
    let limit = 50;
    let offset = 0;
    let status: string | undefined;

    if (typeof arg1 === 'object' && arg1 !== null) {
      limit = arg1.limit || 50;
      offset = arg1.offset || 0;
      status = arg1.status;
    } else {
      limit = arg1 || 50;
      offset = arg2 || 0;
    }

    let query = `/orders?limit=${limit}&offset=${offset}`;
    if (status) query += `&status=${status}`;
    const response = await apiClient.get<{ success: boolean; data: Order[] }>(query);
    return response.data.data;
  },

  getById: async (orderId: number) => {
    const response = await apiClient.get<{ success: boolean; data: OrderWithDetails }>(
      `/orders/${orderId}`
    );
    return response.data.data;
  },

  create: async (orderData: CreateOrderInput) => {
    const response = await apiClient.post<{ success: boolean; data: OrderWithDetails }>(
      '/orders',
      orderData
    );
    return response.data.data;
  },

  update: async (orderId: number, updateData: UpdateOrderInput) => {
    const response = await apiClient.put<{ success: boolean; data: Order }>(
      `/orders/${orderId}`,
      updateData
    );
    return response.data.data;
  },

  delete: async (orderId: number) => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `/orders/${orderId}`
    );
    return response.data;
  },

  getStats: async () => {
    const response = await apiClient.get<{
      success: boolean;
      data: { status: string; count: number; totalAmount: number }[];
    }>('/orders/stats');
    return response.data.data;
  },

  clearPayment: async (orderId: number) => {
    const response = await apiClient.put<{ success: boolean; data: Order; message: string }>(
      `/orders/${orderId}/payment-clearance`,
      {}
    );
    return response.data;
  },
};
