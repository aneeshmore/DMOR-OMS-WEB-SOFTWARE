# 🚀 Professional Drizzle ORM Workflow Guide

## Overview

This project uses **Drizzle ORM** as the primary database abstraction layer with PostgreSQL (Neon). All database operations should use Drizzle instead of raw SQL queries for type safety, better performance, and maintainability.

---

## 🏗️ Architecture

```
src/
├── db/
│   ├── index.js          # Drizzle instance & connection
│   ├── seed.js           # Professional seed script
│   ├── migrate.js        # Migration runner (deprecated - use drizzle-kit)
│   └── schema/
│       ├── index.js      # Export all schemas
│       ├── tables.js     # Table definitions
│       └── relations.js  # Table relationships
└── modules/
    └── [feature]/
        ├── repository.js # Data access layer (uses Drizzle)
        ├── service.js    # Business logic
        ├── controller.js # HTTP handlers
        └── routes.js     # Express routes
```

---

## 📋 Professional Drizzle Workflow

### **1. Schema Design (First Time Setup)**

Your schema is already defined in `src/db/schema/tables.js`. Keep it in sync with `database_schemas/schema.sql`.

```javascript
// Example: Adding a new table
export const myNewTable = appSchema.table('my_new_table', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
```

### **2. Generate Migrations**

After modifying your schema in `tables.js`:

```bash
# Generate migration SQL files
pnpm db:generate

# This creates migration files in database_schemas/migrations/
```

### **3. Apply Migrations**

Push schema changes to the database:

```bash
# For production (recommended - uses migration files)
pnpm db:migrate
```

### **4. Seed the Database**

Use the Drizzle-based seed script:

```bash
pnpm db:seed
```

### **5. Inspect Database**

Launch Drizzle Studio for a visual database browser:

```bash
pnpm db:studio
# Opens https://local.drizzle.studio
```

---

## 🔄 Daily Development Workflow

### **Starting Fresh**

```bash
# 1. Reset database (drops all schemas)
pnpm db:reset

# 2. Seed with initial data
pnpm db:seed

# 3. Start development server
pnpm dev
```

### **Making Schema Changes**

```bash
# 1. Edit src/db/schema/tables.js
# 2. Generate migration
pnpm db:generate

# 3. Apply to database
pnpm db:push  # Dev only

# 4. Commit migration files to git
git add database_schemas/migrations/
git commit -m "feat: add new table"
```

---

## 💡 Best Practices

### **1. Use Repository Pattern**

Always create a repository file for data access:

```javascript
// src/modules/products/repository.js
import { eq } from 'drizzle-orm';
import db from '../../db/index.js';
import { products } from '../../db/schema/index.js';

export class ProductsRepository {
  async findAll() {
    return await db.select().from(products);
  }

  async findById(id) {
    const result = await db.select().from(products).where(eq(products.productId, id)).limit(1);
    return result[0] || null;
  }

  async create(data) {
    const result = await db.insert(products).values(data).returning();
    return result[0];
  }

  async update(id, data) {
    const result = await db
      .update(products)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(products.productId, id))
      .returning();
    return result[0];
  }
}
```

### **2. Use Services for Business Logic**

```javascript
// src/modules/products/service.js
import { ProductsRepository } from './repository.js';
import { AppError } from '../../utils/AppError.js';

export class ProductsService {
  constructor() {
    this.repository = new ProductsRepository();
  }

  async getProductById(id) {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }
}
```

### **3. Controllers Stay Thin**

```javascript
// src/modules/products/controller.js
export class ProductsController {
  constructor() {
    this.service = new ProductsService();
  }

  getProduct = async (req, res, next) => {
    try {
      const product = await this.service.getProductById(req.params.id);
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };
}
```

---

## 🎯 Common Drizzle Patterns

### **Querying with Joins**

```javascript
import { eq } from 'drizzle-orm';

const result = await db
  .select()
  .from(employees)
  .leftJoin(departments, eq(employees.departmentId, departments.departmentId))
  .where(eq(employees.employeeId, id));
```

### **Filtering**

```javascript
import { eq, and, or, like, gt } from 'drizzle-orm';

// Single condition
await db.select().from(products).where(eq(products.isActive, true));

// Multiple conditions
await db
  .select()
  .from(products)
  .where(and(eq(products.isActive, true), gt(products.availableQuantity, '0')));

// OR conditions
await db
  .select()
  .from(products)
  .where(or(eq(products.productType, 'FG'), eq(products.productType, 'RM')));

// Pattern matching
await db.select().from(products).where(like(products.productName, '%PAINT%'));
```

### **Ordering & Pagination**

```javascript
import { desc, asc } from 'drizzle-orm';

await db.select().from(products).orderBy(desc(products.createdAt)).limit(10).offset(0);
```

### **Transactions**

```javascript
import db from '../../db/index.js';

await db.transaction(async tx => {
  const order = await tx.insert(orders).values(orderData).returning();
  await tx.insert(orderDetails).values(detailsData);
  return order[0];
});
```

---

## 🚫 What NOT to Do

❌ **Don't use raw SQL queries:**

```javascript
// BAD
await query('SELECT * FROM app.products WHERE product_id = $1', [id]);

// GOOD
await db.select().from(products).where(eq(products.productId, id));
```

❌ **Don't mix pool.query() with Drizzle:**

```javascript
// BAD
import pool from '../../config/database.js';
await pool.query('SELECT...');

// GOOD
import db from '../../db/index.js';
await db.select()...
```

❌ **Don't modify schema.sql directly - always update tables.js first**

---

## 🔧 Troubleshooting

### **Schema out of sync**

```bash
# Regenerate from current schema
pnpm db:generate
pnpm db:push
```

### **Connection issues**

```bash
# Check .env file has DATABASE_URL
# Verify Neon database is accessible
```

### **Migration conflicts**

```bash
# Reset everything (DEV ONLY!)
pnpm db:reset
pnpm db:seed
```

---

## 📚 Resources

- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Drizzle Kit CLI](https://orm.drizzle.team/kit-docs/overview)
- [PostgreSQL Data Types](https://orm.drizzle.team/docs/column-types/pg)
- [Query Examples](https://orm.drizzle.team/docs/select)

---

## ✅ Summary

**Professional Drizzle workflow:**

1. ✏️ Modify `src/db/schema/tables.js`
2. 🔄 Run `pnpm db:generate` to create migrations
3. 🚀 Run `pnpm db:push` (dev) or `pnpm db:migrate` (prod)
4. 🌱 Run `pnpm db:seed` for initial data
5. 👀 Run `pnpm db:studio` to inspect database
6. 💻 Use Repository pattern in your modules
7. 🎉 Never write raw SQL queries again!

**Your database layer is now type-safe, maintainable, and production-ready! 🚀**
