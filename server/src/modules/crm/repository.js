import { db } from '../../db/index.js';
import { visits } from '../../db/schema/crm/visits.js';
import { eq, desc } from 'drizzle-orm';

export class CrmRepository {
  async createVisit(visitData) {
    const [visit] = await db.insert(visits).values(visitData).returning();
    return visit;
  }

  async getVisits(filters = {}, userContext = null) {
    // Role-based scoping
    let salesExecutiveId = filters.salesExecutiveId;

    if (userContext) {
      const allowedRoles = ['Admin', 'SuperAdmin', 'Accounts Manager'];
      const hasFullAccess = allowedRoles.includes(userContext.role);

      if (!hasFullAccess) {
        // Force filter to own ID if not an admin/manager
        salesExecutiveId = userContext.employeeId;
      }
    }

    return await db.query.visits.findMany({
      where: (visits, { eq, and }) => {
        const conditions = [];
        if (filters.customerId) {
          conditions.push(eq(visits.customerId, filters.customerId));
        }
        if (salesExecutiveId) {
          conditions.push(eq(visits.salesExecutiveId, salesExecutiveId));
        }
        return conditions.length > 0 ? and(...conditions) : undefined;
      },
      with: {
        customer: true,
        salesExecutive: true,
      },
      orderBy: (visits, { desc }) => [desc(visits.visitDate)],
    });
  }

  async updateVisit(visitId, updateData) {
    // Sanitize date for Drizzle
    const data = { ...updateData };
    if (data.nextVisitDate && typeof data.nextVisitDate === 'string') {
      data.nextVisitDate = new Date(data.nextVisitDate);
    }

    console.log(`Repo: Updating visit ${visitId} with data:`, data);
    const result = await db
      .update(visits)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(visits.visitId, visitId))
      .returning();

    console.log('Repo: Update result:', result);
    return result[0];
  }
}
