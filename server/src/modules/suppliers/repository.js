import { eq } from 'drizzle-orm';
import db from '../../db/index.js';
import { suppliers } from '../../db/schema/index.js';

export class SuppliersRepository {
  async findAll(filters = {}) {
    let query = db.select().from(suppliers);

    if (filters.isActive !== undefined) {
      query = query.where(eq(suppliers.isActive, filters.isActive));
    }

    return await query.orderBy(suppliers.supplierName);
  }

  async findById(supplierId) {
    const result = await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.supplierId, supplierId))
      .limit(1);

    return result[0] || null;
  }

  async findByName(supplierName) {
    const result = await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.supplierName, supplierName))
      .limit(1);

    return result[0] || null;
  }

  async create(supplierData) {
    const result = await db.insert(suppliers).values(supplierData).returning();
    return result[0];
  }

  async update(supplierId, updateData) {
    const result = await db
      .update(suppliers)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(suppliers.supplierId, supplierId))
      .returning();

    return result[0];
  }

  async delete(supplierId) {
    const result = await db
      .update(suppliers)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(suppliers.supplierId, supplierId))
      .returning();

    return result[0];
  }
}
