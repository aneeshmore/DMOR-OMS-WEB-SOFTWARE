import { z } from 'zod';

export const startBatchSchema = z.object({
  supervisorId: z.number().int().positive().optional(),
  labourNames: z.string().optional(),
  notes: z.string().optional(),
  startedAt: z.string().datetime().optional(),
});

export const completeBatchSchema = z.object({
  actualQuantity: z.number().positive(),
  actualDensity: z.number().optional(),
  actualWaterPercentage: z.number().min(0).max(100).optional(),
  actualViscosity: z.string().optional(),
  completedAt: z.string().datetime().optional(),
  productionRemarks: z.string().optional(),
  completedBy: z.number().int().positive(),
  materialConsumption: z
    .array(
      z.object({
        materialId: z.number().int().positive(),
        actualQuantity: z.number().positive(),
      })
    )
    .optional(),
  outputSkus: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        producedUnits: z.number().nonnegative(),
        weightKg: z.union([z.number(), z.string()]).optional(),
      })
    )
    .optional(),
});

export const cancelBatchSchema = z.object({
  reason: z.string().min(10, 'Cancellation reason must be at least 10 characters'),
  cancelledBy: z.number().int().positive(),
});
