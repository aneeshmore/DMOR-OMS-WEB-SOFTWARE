import { z } from 'zod';

export const createNotificationSchema = z.object({
  recipientId: z.number().int().positive(),
  type: z.string().min(1).max(50),
  title: z.string().min(1).max(255),
  message: z.string().min(1),
  data: z.any().optional(),
  priority: z.enum(['low', 'normal', 'high', 'critical']).default('normal'),
});

export const updateNotificationSchema = z.object({
  isRead: z.boolean().optional(),
  isAcknowledged: z.boolean().optional(),
});

export const getNotificationsSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
  isRead: z.coerce.boolean().optional(),
  priority: z.enum(['low', 'normal', 'high', 'critical']).optional(),
  type: z.string().optional(),
});
