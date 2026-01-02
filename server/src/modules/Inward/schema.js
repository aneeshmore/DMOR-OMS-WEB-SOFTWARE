import { z } from 'zod';

const inwardItemSchema = z.object({
  masterProductId: z.number().int().positive(),
  productId: z.number().int().positive().optional(), // For FG: specific SKU
  inwardDate: z.string().datetime().optional(),
  quantity: z.number().positive(),
  unitId: z.number().int().positive().optional(),
  unitPrice: z.number().nonnegative().optional(),
  totalCost: z.number().nonnegative().optional(),
});

export const createInwardSchema = z.object({
  billNo: z.string().max(50).optional().or(z.literal('')),
  supplierId: z.number().int().positive('Supplier is required').optional(), // Optional for FG

  notes: z.string().optional(),
  items: z.array(inwardItemSchema).min(1, 'At least one item is required'),
});

export const updateInwardSchema = z.object({
  masterProductId: z.number().int().positive().optional(),
  productId: z.number().int().positive().optional(), // For FG: specific SKU
  inwardDate: z.string().datetime().optional(),
  billNo: z.string().max(50).optional(),
  quantity: z.number().positive().optional(),
  unitId: z.number().int().positive().optional(),
  unitPrice: z.number().nonnegative().optional(),
  totalCost: z.number().nonnegative().optional(),
  notes: z.string().optional(),
  supplierId: z.number().int().positive().optional(),
});
