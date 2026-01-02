import { z } from 'zod';

export const createProductionBatchSchema = z.object({
  batchId: z.string().max(50),
  productId: z.number().int().positive(),
  plannedProductionQty: z.number().positive(),
  supervisorId: z.number().int().positive().optional(),
  remarks: z.string().optional(),
});

export const updateProductionBatchSchema = z.object({
  actualProductionQty: z.number().positive().optional(),
  status: z.enum(['Scheduled', 'In Progress', 'Completed', 'Cancelled']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  remarks: z.string().optional(),
});
