/**
 * Quotations Schema
 *
 * Tracks generated quotations.
 */

import { serial, varchar, jsonb, timestamp, integer } from 'drizzle-orm/pg-core';
import { appSchema } from '../core/app-schema.js';

export const quotations = appSchema.table('quotations', {
  quotationId: serial('quotation_id').primaryKey(),
  quotationNo: varchar('quotation_no', { length: 50 }).notNull(), // e.g QT/23-24/1228
  quotationDate: varchar('quotation_date', { length: 50 }), // Storing as string for "as is" preservation

  companyName: varchar('company_name', { length: 255 }), // For the table view
  buyerName: varchar('buyer_name', { length: 255 }), // For the table view

  // Link to customer for easy reference
  customerId: integer('customer_id'),

  // The full data object from the frontend (QuotationData)
  content: jsonb('content').notNull(),

  // Status: Pending, Approved, Rejected, Converted
  status: varchar('status', { length: 20 }).notNull().default('Pending'),

  // Admin rejection remark
  rejectionRemark: varchar('rejection_remark', { length: 500 }),

  // Who created this quotation (salesperson/user)
  createdBy: integer('created_by'),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
