/**
 * Accounts Schema
 *
 * Tracks payment, billing, and accounting information for orders.
 * Managed primarily by accountants for financial tracking and reconciliation.
 */

import {
  serial,
  uuid,
  varchar,
  integer,
  numeric,
  boolean,
  text,
  timestamp,
  date,
} from 'drizzle-orm/pg-core';
import { appSchema } from '../core/app-schema.js';
import { orders } from './orders.js';
import { employees } from '../organization/employees.js';

export const accounts = appSchema.table('accounts', {
  accountId: serial('account_id').primaryKey(),
  accountUuid: uuid('account_uuid').defaultRandom().notNull(),

  // Order Reference
  orderId: integer('order_id')
    .notNull()
    .unique()
    .references(() => orders.orderId, { onDelete: 'cascade' }),

  // Billing Information
  billNo: varchar('bill_no', { length: 50 }),
  billDate: date('bill_date'),
  billAmount: numeric('bill_amount', { precision: 14, scale: 2 }),

  // Payment Information
  paymentStatus: varchar('payment_status', { length: 20 }).notNull().default('Pending'), // Pending, Partial, Cleared, Overdue
  paymentCleared: boolean('payment_cleared').default(false),
  paymentDate: date('payment_date'),
  paymentMethod: varchar('payment_method', { length: 50 }), // Cash, Card, UPI, Bank Transfer, Cheque
  paymentReference: varchar('payment_reference', { length: 100 }), // Transaction ID, Cheque No, etc.

  // Accountant Management
  accountantId: integer('accountant_id').references(() => employees.employeeId, {
    onDelete: 'set null',
  }),
  processedDate: timestamp('processed_date', { withTimezone: true }),

  // Additional Information
  remarks: text('remarks'),

  // Tax Information
  taxAmount: numeric('tax_amount', { precision: 14, scale: 2 }).default('0'),
  taxPercentage: numeric('tax_percentage', { precision: 5, scale: 2 }).default('0'),

  // Audit Trail
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
