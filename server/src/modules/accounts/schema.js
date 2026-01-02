import { z } from 'zod';

/**
 * Account Validation Schemas
 */

// Create Account Schema
export const createAccountSchema = z.object({
  orderId: z.number().int().positive(),
  billNo: z.string().max(50).optional(),
  billDate: z.string().datetime().or(z.date()).optional(),
  billAmount: z.number().positive().optional(),
  paymentStatus: z.enum(['Pending', 'Partial', 'Cleared', 'Overdue']).default('Pending'),
  paymentCleared: z.boolean().default(false),
  paymentDate: z.string().datetime().or(z.date()).optional(),
  paymentMethod: z
    .enum(['Cash', 'Card', 'UPI', 'Bank Transfer', 'Cheque', 'Net Banking', 'Other'])
    .optional(),
  paymentReference: z.string().max(100).optional(),
  accountantId: z.number().int().positive().optional(),
  processedDate: z.string().datetime().or(z.date()).optional(),
  remarks: z.string().optional(),
  taxAmount: z.number().min(0).default(0),
  taxPercentage: z.number().min(0).max(100).default(0),
});

// Update Account Schema
export const updateAccountSchema = z.object({
  billNo: z.string().max(50).optional(),
  billDate: z.string().datetime().or(z.date()).optional(),
  billAmount: z.number().positive().optional(),
  paymentStatus: z.enum(['Pending', 'Partial', 'Cleared', 'Overdue']).optional(),
  paymentCleared: z.boolean().optional(),
  paymentDate: z.string().datetime().or(z.date()).optional(),
  paymentMethod: z
    .enum(['Cash', 'Card', 'UPI', 'Bank Transfer', 'Cheque', 'Net Banking', 'Other'])
    .optional(),
  paymentReference: z.string().max(100).optional(),
  accountantId: z.number().int().positive().optional(),
  processedDate: z.string().datetime().or(z.date()).optional(),
  remarks: z.string().optional(),
  taxAmount: z.number().min(0).optional(),
  taxPercentage: z.number().min(0).max(100).optional(),
});

// Update Payment Schema
export const updatePaymentSchema = z.object({
  paymentStatus: z.enum(['Pending', 'Partial', 'Cleared', 'Overdue']),
  paymentCleared: z.boolean().optional(),
  paymentDate: z.string().datetime().or(z.date()).optional(),
  paymentMethod: z
    .enum(['Cash', 'Card', 'UPI', 'Bank Transfer', 'Cheque', 'Net Banking', 'Other'])
    .optional(),
  paymentReference: z.string().max(100).optional(),
  accountantId: z.number().int().positive().optional(),
  remarks: z.string().optional(),
});
