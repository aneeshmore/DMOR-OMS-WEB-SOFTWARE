import db from '../../db/index.js';
import { accounts, orders, employees } from '../../db/schema/index.js';
import { eq, and, gte, lte, desc, sql } from 'drizzle-orm';
import { AccountDTO, AccountWithOrderDTO } from './dto.js';

/**
 * Account Service
 */

class AccountService {
  /**
   * Get all accounts with pagination
   */
  async getAll(limit = 100, offset = 0, filters = {}) {
    const conditions = [];

    if (filters.paymentStatus) {
      conditions.push(eq(accounts.paymentStatus, filters.paymentStatus));
    }

    if (filters.deliveryStatus) {
      conditions.push(eq(accounts.deliveryStatus, filters.deliveryStatus));
    }

    if (filters.paymentCleared !== undefined) {
      conditions.push(eq(accounts.paymentCleared, filters.paymentCleared));
    }

    if (filters.accountantId) {
      conditions.push(eq(accounts.accountantId, filters.accountantId));
    }

    if (filters.fromDate) {
      conditions.push(gte(accounts.billDate, filters.fromDate));
    }

    if (filters.toDate) {
      conditions.push(lte(accounts.billDate, filters.toDate));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const results = await db
      .select()
      .from(accounts)
      .leftJoin(orders, eq(accounts.orderId, orders.orderId))
      .leftJoin(employees, eq(accounts.accountantId, employees.employeeId))
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(accounts.createdAt));

    return results.map(row =>
      AccountWithOrderDTO({
        ...row.accounts,
        order: row.orders,
        accountant: row.employees,
      })
    );
  }

  /**
   * Get account by ID
   */
  async getById(id) {
    const results = await db
      .select()
      .from(accounts)
      .leftJoin(orders, eq(accounts.orderId, orders.orderId))
      .leftJoin(employees, eq(accounts.accountantId, employees.employeeId))
      .where(eq(accounts.accountId, id))
      .limit(1);

    if (results.length === 0) {
      return null;
    }

    const row = results[0];
    return AccountWithOrderDTO({
      ...row.accounts,
      order: row.orders,
      accountant: row.employees,
    });
  }

  /**
   * Get account by Order ID
   */
  async getByOrderId(orderId) {
    const results = await db
      .select()
      .from(accounts)
      .leftJoin(orders, eq(accounts.orderId, orders.orderId))
      .leftJoin(employees, eq(accounts.accountantId, employees.employeeId))
      .where(eq(accounts.orderId, orderId))
      .limit(1);

    if (results.length === 0) {
      return null;
    }

    const row = results[0];
    return AccountWithOrderDTO({
      ...row.accounts,
      order: row.orders,
      accountant: row.employees,
    });
  }

  /**
   * Create new account
   */
  async create(data) {
    const [account] = await db.insert(accounts).values(data).returning();
    return AccountDTO(account);
  }

  /**
   * Update account
   */
  async update(id, data) {
    const [account] = await db
      .update(accounts)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(accounts.accountId, id))
      .returning();

    return account ? AccountDTO(account) : null;
  }

  /**
   * Update payment information
   */
  async updatePayment(id, paymentData) {
    const updateData = {
      ...paymentData,
      updatedAt: new Date(),
    };

    // If payment is cleared, set processedDate
    if (paymentData.paymentCleared && paymentData.paymentStatus === 'Cleared') {
      updateData.processedDate = new Date();
      updateData.balanceAmount = '0.00';
    }

    const [account] = await db
      .update(accounts)
      .set(updateData)
      .where(eq(accounts.accountId, id))
      .returning();

    return account ? AccountDTO(account) : null;
  }

  /**
   * Update delivery information
   */
  async updateDelivery(id, deliveryData) {
    const [account] = await db
      .update(accounts)
      .set({
        ...deliveryData,
        updatedAt: new Date(),
      })
      .where(eq(accounts.accountId, id))
      .returning();

    return account ? AccountDTO(account) : null;
  }

  /**
   * Delete account
   */
  async delete(id) {
    const [account] = await db.delete(accounts).where(eq(accounts.accountId, id)).returning();

    return !!account;
  }

  /**
   * Get payment summary statistics
   */
  async getPaymentSummary() {
    const [summary] = await db
      .select({
        totalBilled: sql`COALESCE(SUM(${accounts.billAmount}), 0)`,
        totalPaid: sql`COALESCE(SUM(${accounts.paidAmount}), 0)`,
        totalBalance: sql`COALESCE(SUM(${accounts.balanceAmount}), 0)`,
        clearedCount: sql`COUNT(CASE WHEN ${accounts.paymentCleared} = true THEN 1 END)`,
        pendingCount: sql`COUNT(CASE WHEN ${accounts.paymentStatus} = 'Pending' THEN 1 END)`,
        partialCount: sql`COUNT(CASE WHEN ${accounts.paymentStatus} = 'Partial' THEN 1 END)`,
        overdueCount: sql`COUNT(CASE WHEN ${accounts.paymentStatus} = 'Overdue' THEN 1 END)`,
      })
      .from(accounts);

    return {
      totalBilled: parseFloat(summary.totalBilled) || 0,
      totalPaid: parseFloat(summary.totalPaid) || 0,
      totalBalance: parseFloat(summary.totalBalance) || 0,
      clearedCount: parseInt(summary.clearedCount) || 0,
      pendingCount: parseInt(summary.pendingCount) || 0,
      partialCount: parseInt(summary.partialCount) || 0,
      overdueCount: parseInt(summary.overdueCount) || 0,
    };
  }
}

export default new AccountService();
