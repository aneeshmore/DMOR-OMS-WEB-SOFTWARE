import { z } from 'zod';

export const approveOrderSchema = z.object({
  expectedDeliveryDate: z.string().optional(),
  remarks: z.string().optional(),
});
