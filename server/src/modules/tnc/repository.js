import { eq, desc } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { tnc } from '../../db/schema/core/tnc.js';

export class TncRepository {
  async create(data) {
    const result = await db.insert(tnc).values(data).returning();
    return result[0];
  }

  async findAll() {
    return await db.select().from(tnc).orderBy(desc(tnc.createdAt));
  }

  async findById(id) {
    const result = await db.select().from(tnc).where(eq(tnc.tncId, id));
    return result[0];
  }

  async update(id, data) {
    const result = await db
      .update(tnc)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tnc.tncId, id))
      .returning();
    return result[0];
  }

  async delete(id) {
    const result = await db.delete(tnc).where(eq(tnc.tncId, id)).returning();
    return result[0];
  }
}
