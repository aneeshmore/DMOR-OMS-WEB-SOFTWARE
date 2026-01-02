/**
 * Employee Roles Schema
 *
 * Assigns roles to employees.
 * Tracks when roles were assigned and whether they are locked.
 */

import { serial, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { appSchema } from '../core/app-schema.js';
import { roles } from './roles.js';
import { employees } from '../organization/employees.js';

export const employeeRoles = appSchema.table('employee_roles', {
  employeeRoleId: serial('employee_role_id').primaryKey(),
  employeeId: integer('employee_id')
    .notNull()
    .references(() => employees.employeeId, { onDelete: 'cascade' }),
  roleId: integer('role_id')
    .notNull()
    .references(() => roles.roleId, { onDelete: 'cascade' }),
  isLocked: boolean('is_locked').notNull().default(false),
  assignedAt: timestamp('assigned_at', { withTimezone: true }).defaultNow(),
});
