import { z } from 'zod';

export const createProductSchema = z.object({
  productName: z.string().max(255),
  masterProductId: z.number().int().positive().optional(),
  unitId: z.number().int().positive(),
  productType: z.enum(['FG', 'RM', 'PM', 'PKG']),
  sellingPrice: z.number().nonnegative().optional(),
  minStockLevel: z.number().nonnegative().optional(),
  density: z.number().optional(),
});

export const updateProductSchema = z.object({
  productName: z.string().max(255).optional(),
  masterProductId: z.number().int().positive().optional(),
  sellingPrice: z.number().nonnegative().optional(),
  minStockLevel: z.number().nonnegative().optional(),
  density: z.number().optional(),
  isActive: z.boolean().optional(),
});
