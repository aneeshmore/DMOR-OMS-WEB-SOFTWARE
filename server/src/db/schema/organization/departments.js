/**
 * Departments Schema
 *
 * Organizational departments within the company.
 * Can have a designated department head (employee).
 */

import { serial, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';
import { appSchema } from '../core/app-schema.js';

export const departments = appSchema.table('departments', {
  departmentId: serial('department_id').primaryKey(),
  departmentName: varchar('department_name', { length: 100 }).notNull().unique(),
  isActive: boolean('is_active').notNull().default(true),
  isSystemDepartment: boolean('is_system_department').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
