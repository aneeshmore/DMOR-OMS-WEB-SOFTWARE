/**
 * Notifications Schema
 *
 * Schema for system notifications including alerts, messages, and system events.
 */

import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  timestamp,
  boolean,
  jsonb,
} from 'drizzle-orm/pg-core';
import { appSchema } from '../core/app-schema.js';
import { employees } from '../organization/employees.js';

export const notifications = appSchema.table('notifications', {
  notificationId: serial('notification_id').primaryKey(),
  recipientId: integer('recipient_id').references(() => employees.employeeId),
  type: varchar('type', { length: 50 }).notNull(), // 'MaterialShortage', 'OrderAccepted', etc.
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  data: jsonb('data'), // Additional data like orderId, shortages, etc.
  priority: varchar('priority', { length: 20 }).default('normal'), // 'low', 'normal', 'high', 'critical'
  isRead: boolean('is_read').default(false),
  isAcknowledged: boolean('is_acknowledged').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Indexes
export const notificationsIndexes = {
  recipientIdIdx: 'notifications_recipient_id_idx',
  typeIdx: 'notifications_type_idx',
  priorityIdx: 'notifications_priority_idx',
  isReadIdx: 'notifications_is_read_idx',
  isAcknowledgedIdx: 'notifications_is_acknowledged_idx',
  createdAtIdx: 'notifications_created_at_idx',
};
