// Production Feature Types

export interface ProductionBatch {
  batchId: string;
  productId: number;
  plannedProductionQty: number;
  actualProductionQty: number;
  status: 'Planned' | 'Started' | 'Completed' | 'Cancelled';
  supervisorId?: number;
  startDate?: string;
  endDate?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductionBatchInput {
  batchId: string;
  productId: number;
  plannedProductionQty: number;
  supervisorId?: number;
  remarks?: string;
}

export interface UpdateProductionBatchInput {
  actualProductionQty?: number;
  status?: ProductionBatch['status'];
  startDate?: string;
  endDate?: string;
  remarks?: string;
}
