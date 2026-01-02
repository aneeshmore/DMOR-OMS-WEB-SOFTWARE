import { z } from 'zod';

export const orderStatusSchema = z.object({
  status: z
    .enum([
      'Pending',
      'On Hold',
      'Accepted',
      'Scheduled for Production',
      'Ready for Dispatch',
      'Dispatched',
      'Delivered',
      'Cancelled',
    ])
    .optional()
    .default('Pending'),
});
