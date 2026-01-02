/**
 * Organization Relations
 *
 * Defines relationships between organizational entities
 * (departments, employees, designations, branches).
 */

import { relations } from 'drizzle-orm';
import { departments } from './departments.js';

import { employees } from './employees.js';
import { branches } from './branches.js';

// Departments Relations
export const departmentsRelations = relations(departments, ({ many }) => ({
  employees: many(employees),
}));

// Employees Relations
export const employeesRelations = relations(employees, ({ one }) => ({
  department: one(departments, {
    fields: [employees.departmentId],
    references: [departments.departmentId],
  }),

  currentBranch: one(branches, {
    fields: [employees.currentBranchId],
    references: [branches.branchId],
  }),
}));

// Branches Relations
export const branchesRelations = relations(branches, ({ many }) => ({
  employees: many(employees),
}));
