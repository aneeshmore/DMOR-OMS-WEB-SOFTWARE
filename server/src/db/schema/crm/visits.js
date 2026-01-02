import { serial, integer, timestamp, varchar, text, boolean } from 'drizzle-orm/pg-core';
import { appSchema } from '../core/app-schema.js';

export const visits = appSchema.table('crm_visits', {
  visitId: serial('visit_id').primaryKey(),
  visitDate: timestamp('visit_date', { withTimezone: true }).defaultNow().notNull(),
  salesExecutiveId: integer('sales_executive_id').notNull(),
  customerId: integer('customer_id').notNull(),
  visitType: varchar('visit_type', { length: 50 }).notNull(), // 'New Visit', 'Follow-up Visit'
  leadStatus: text('lead_status').default('Contacted'),
  notes: text('notes').notNull(),
  isNextVisitRequired: boolean('is_next_visit_required').default(false).notNull(),
  nextVisitDate: timestamp('next_visit_date', { withTimezone: true }),
  nextVisitNotes: text('next_visit_notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
