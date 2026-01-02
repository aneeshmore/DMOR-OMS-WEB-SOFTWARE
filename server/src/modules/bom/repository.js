import { eq, and } from 'drizzle-orm';
import db from '../../db/index.js';
import { productBom, products, masterProducts } from '../../db/schema/index.js';
import { alias } from 'drizzle-orm/pg-core';

export class BOMRepository {
  async getAllFinishedGoods() {
    const result = await db
      .selectDistinct({
        productId: products.productId,
        productName: products.productName,
      })
      .from(productBom)
      .leftJoin(products, eq(productBom.finishedGoodId, products.productId))
      .leftJoin(masterProducts, eq(products.masterProductId, masterProducts.masterProductId))
      .where(eq(masterProducts.productType, 'FG'))
      .orderBy(products.productName);

    return result.map(item => ({
      ProductID: item.productId,
      ProductName: item.productName,
    }));
  }

  async findByFinishedGood(finishedGoodId) {
    const rawMaterial = alias(products, 'raw_material');

    return await db
      .select({
        bom: productBom,
        finishedGood: products,
        rawMaterial,
      })
      .from(productBom)
      .leftJoin(products, eq(productBom.finishedGoodId, products.productId))
      .leftJoin(rawMaterial, eq(productBom.rawMaterialId, rawMaterial.productId))
      .where(eq(productBom.finishedGoodId, finishedGoodId));
  }

  async findById(bomId) {
    const result = await db.select().from(productBom).where(eq(productBom.bomId, bomId)).limit(1);

    return result[0] || null;
  }

  async create(bomData) {
    const result = await db.insert(productBom).values(bomData).returning();

    return result[0];
  }

  async update(bomId, updateData) {
    const result = await db
      .update(productBom)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(productBom.bomId, bomId))
      .returning();

    return result[0];
  }

  async delete(bomId) {
    await db.delete(productBom).where(eq(productBom.bomId, bomId));
  }

  async deleteByFinishedGood(finishedGoodId) {
    await db.delete(productBom).where(eq(productBom.finishedGoodId, finishedGoodId));
  }
}
