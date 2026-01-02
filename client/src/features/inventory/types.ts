// Inventory Feature Types

export interface Product {
  productId: number;
  productUuid: string;
  productName: string;
  masterProductId?: number;
  masterProductName?: string;
  unitId: number;
  productType: 'FG' | 'RM' | 'PM';
  sellingPrice: number;
  minStockLevel: number;
  availableQuantity: number;
  purchaseCost?: number; // Added for RM/PM
  density?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // FG-specific fields for auto-add Hardener feature
  Subcategory?: string | null; // 'Base' | 'Hardener' | 'General'
  HardenerId?: number | null; // Master Product ID of linked Hardener
  CapacityLtr?: number | null; // PM packaging capacity in liters
}

export interface StockLedger {
  ledgerId: number;
  productId: number;
  changeType: string;
  changeQty: number;
  referenceTable?: string;
  referenceId?: number;
  createdBy?: number;
  createdAt: string;
  notes?: string;
}

export interface CreateProductInput {
  productName: string;
  masterProductId?: number;
  unitId: number;
  productType: 'FG' | 'RM' | 'PM';
  sellingPrice?: number;
  minStockLevel?: number;
  density?: number;
}

export interface UpdateProductInput {
  productName?: string;
  masterProductId?: number;
  sellingPrice?: number;
  minStockLevel?: number;
  density?: number;
  isActive?: boolean;
}
