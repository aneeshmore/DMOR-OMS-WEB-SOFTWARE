import { z } from 'zod';

export const clearPaymentSchema = z.object({
  remarks: z.string().optional(),
});

export const acceptOrderSchema = z.object({
  billNo: z.string().optional(),
  billDate: z.string().optional(), // ISO date string
  billAmount: z.number().optional(),
  paymentStatus: z.enum(['Pending', 'Partial', 'Cleared', 'Overdue']).default('Cleared'),
  paymentMethod: z
    .enum(['Cash', 'Card', 'UPI', 'Bank Transfer', 'Cheque', 'Net Banking', 'Other'])
    .optional(),
  paymentReference: z.string().optional(),
  paymentDate: z.string().optional(), // ISO date string
  adminRemarks: z.string().optional(),
});

export const holdOrderSchema = z.object({
  holdReason: z.string().min(1, 'Reason is required for holding an order'),
});

export const rejectOrderSchema = z.object({
  rejectReason: z.string().min(1, 'Reason is required for rejecting an order'),
});
