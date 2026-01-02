import { z } from 'zod';

export const createQuotationSchema = z.object({
  quotationNo: z.string(),
  quotationDate: z.string(),
  companyName: z.string().optional(),
  buyerName: z.string().optional(),
  content: z.record(z.any()), // The full JSON object
});

export const updatestatusSchema = z.object({
  status: z.enum(['Draft', 'Generated', 'Pending', 'Approved', 'Sent', 'Received', 'Converted']),
});
