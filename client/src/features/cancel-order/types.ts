export interface CancelOrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  unit: string;
}

export interface CancelOrderRecord {
  orderId: number;
  orderNumber: string;
  billNo: string | null;
  companyName: string;
  customerName: string;
  orderDate: string;
  expectedDeliveryDate: string | null;
  status: string;
  totalAmount: number;
  items: CancelOrderItem[];
  remarks: string | null;
  cancelReason?: string;
  cancelledAt?: string;
  cancelledBy?: string;
}

export interface CancelOrderPayload {
  orderId: number;
  reason: string;
}
