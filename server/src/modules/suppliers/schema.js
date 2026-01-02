import { z } from 'zod';

export const createSupplierSchema = z.object({
  supplierName: z.string().min(1, 'Supplier name is required').max(255),
});

export const updateSupplierSchema = z.object({
  supplierName: z.string().min(1).max(255).optional(),
  isActive: z.boolean().optional(),
});
