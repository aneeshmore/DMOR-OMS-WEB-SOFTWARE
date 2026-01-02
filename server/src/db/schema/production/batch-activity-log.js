/**
 * Batch Activity Log
 *
 * Tracks all actions and state changes for production batches.
 * Provides complete audit trail for batch lifecycle.
 */

import { bigserial, integer, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { appSchema } from '../core/app-schema.js';
import { productionBatch } from './production-batch.js';
import { employees } from '../organization/employees.js';

export const batchActivityLog = appSchema.table('batch_activity_log', {
  logId: bigserial('log_id', { mode: 'bigint' }).primaryKey(),

  batchId: integer('batch_id')
    .notNull()
    .references(() => productionBatch.batchId, { onDelete: 'cascade' }),

  action: varchar('action', { length: 50 }).notNull(),
  // Values: 'Created', 'Scheduled', 'Started', 'Paused', 'Resumed', 'Completed', 'Cancelled',
  //         'Quality Checked', 'Material Added', 'Material Consumed', 'Modified'

  previousStatus: varchar('previous_status', { length: 20 }),
  newStatus: varchar('new_status', { length: 20 }),

  performedBy: integer('performed_by')
    .notNull()
    .references(() => employees.employeeId),

  notes: text('notes'),
  metadata: text('metadata'), // JSON string for additional contextual data

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
