/**
 * Roles Schema
 *
 * User roles for role-based access control (RBAC).
 * Roles can have multiple permissions assigned to them.
 * Each role belongs to a department.
 */

import { serial, varchar, text, boolean, timestamp, integer } from 'drizzle-orm/pg-core';
import { appSchema } from '../core/app-schema.js';
import { departments } from '../organization/departments.js';

export const roles = appSchema.table('roles', {
  roleId: serial('role_id').primaryKey(),
  roleName: varchar('role_name', { length: 100 }).notNull().unique(),
  description: text('description'),
  departmentId: integer('department_id').references(() => departments.departmentId, {
    onDelete: 'set null',
  }),
  landingPage: varchar('landing_page', { length: 255 }).default('/dashboard'),
  isSalesRole: boolean('is_sales_role').notNull().default(false),
  isSupervisorRole: boolean('is_supervisor_role').notNull().default(false),
  isSystemRole: boolean('is_system_role').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
