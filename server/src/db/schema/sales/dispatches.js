import { pgTable, serial, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { appSchema } from '../core/app-schema.js';

export const dispatches = appSchema.table('dispatches', {
  dispatchId: serial('dispatch_id').primaryKey(),
  vehicleNo: varchar('vehicle_no', { length: 50 }).notNull(),
  driverName: varchar('driver_name', { length: 100 }),
  remarks: text('remarks'),
  status: varchar('status', { length: 50 }).default('In Transit'), // In Transit, Delivered
  dispatchDate: timestamp('dispatch_date', { withTimezone: true }).defaultNow(),

  // Identifying who created it
  createdBy: integer('created_by'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
