import { apiClient } from '@/api/client';

export interface ProductStock {
  MasterProductName: string;
  ProductName: string;
  OrderQty: number;
  AvailableQty: number;
  ProductionQty: number;
  StockStatus: string;
}

export interface OrderPaymentStatus {
  OrderNo: string;
  OrderDate: string;
  CustomerName: string;
  TotalAmount: number;
  PaidAmount: number;
  BalanceAmount: number;
  PaymentStatus: string;
  DelayedDays: number | null;
  ResponsiblePerson: string;
}

export interface ProductionStatusReport {
  BatchNo: string;
  ProductName: string;
  OrderedQty: number;
  ProducedQty: number;
  Status: string;
  StartDate: string;
  EndDate: string | null;
  SupervisorName: string;
}

export interface DashboardOverview {
  productStock: ProductStock[];
  pendingOrders: OrderPaymentStatus[];
  activeProduction: ProductionStatusReport[];
}

export const dashboardApi = {
  getProductStock: async (): Promise<ProductStock[]> => {
    const response = await apiClient.get('/dashboard/product-stock');
    return response.data.data;
  },

  getOrderPaymentStatus: async (
    status: 'Pending' | 'Overdue' | 'All'
  ): Promise<OrderPaymentStatus[]> => {
    const response = await apiClient.get(`/dashboard/order-payment/${status}`);
    return response.data.data;
  },

  getProductionReport: async (): Promise<ProductionStatusReport[]> => {
    const response = await apiClient.get('/dashboard/production-report');
    return response.data.data;
  },

  getDashboardOverview: async (): Promise<DashboardOverview> => {
    const response = await apiClient.get('/dashboard/overview');
    return response.data.data;
  },
};
