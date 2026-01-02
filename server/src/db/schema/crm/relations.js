import { relations } from 'drizzle-orm';
import { visits } from './visits.js';
import { customers } from '../sales/customers.js';
import { employees } from '../organization/employees.js';

export const visitsRelations = relations(visits, ({ one }) => ({
  customer: one(customers, {
    fields: [visits.customerId],
    references: [customers.customerId],
  }),
  salesExecutive: one(employees, {
    fields: [visits.salesExecutiveId],
    references: [employees.employeeId],
  }),
}));
