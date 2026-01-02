/**
 * Employee Sub Table Schema
 *
 * Additional employee attributes for role-specific flags
 * like sales person and supervisor designations.
 */

import { serial, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { appSchema } from '../core/app-schema.js';
import { employees } from './employees.js';

export const employeeSubTable = appSchema.table('employee_sub_table', {
  id: serial('id').primaryKey(),
  empId: integer('emp_id')
    .notNull()
    .unique()
    .references(() => employees.employeeId, { onDelete: 'cascade' }),
  isSalesPerson: boolean('is_sales_person').notNull().default(false),
  isSupervisor: boolean('is_supervisor').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
