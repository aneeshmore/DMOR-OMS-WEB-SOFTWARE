import { serial, text, timestamp } from 'drizzle-orm/pg-core';
import { appSchema } from './app-schema.js';

export const tnc = appSchema.table('tnc', {
  tncId: serial('tnc_id').primaryKey(),
  type: text('type').notNull().default('General'),
  description: text('description').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
