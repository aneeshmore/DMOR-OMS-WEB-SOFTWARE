import { z } from 'zod';

export const createBOMSchema = z.object({
    finishedGoodId: z.number().int().positive(),
    rawMaterialId: z.number().int().positive(),
    percentage: z.number().min(0).max(100),
});

export const updateBOMSchema = z.object({
    percentage: z.number().min(0).max(100),
});
