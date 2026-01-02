export interface DeliveryItem {
  productName: string;
  quantity: number;
  unit: number; // or string if mapped
}

export interface DeliveryRecord {
  billNo: string | null;
  orderNumber: string;
  companyName: string;
  location: string;
  dispatchDate: string;
  vehicleNo: string;
  driverName: string;
  items: DeliveryItem[];
  status: string;
  orderId: number;
  dispatchId: number;
}
