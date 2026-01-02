# Migration Guide: Old to New Schema Structure

## Overview

This guide helps you migrate from the monolithic `tables.js` and `relations.js` files to the new modular, domain-driven schema structure.

## What Changed?

### Before (Old Structure)

```
schema/
├── index.js          # Simple re-exports
├── tables.js         # ALL tables (380 lines)
└── relations.js      # ALL relations (237 lines)
```

### After (New Structure)

```
schema/
├── index.js                      # Organized exports by domain
├── cross-domain-relations.js     # Cross-domain relationships
├── README.md                     # Complete documentation
├── core/                         # 4 files
├── products/                     # 8 files
├── organization/                 # 6 files
├── sales/                        # 5 files
├── production/                   # 3 files
├── inventory/                    # 5 files
└── auth/                         # 6 files
```

## Benefits of New Structure

✅ **Better Organization**: Related tables grouped by business domain
✅ **Easier Navigation**: Find what you need quickly
✅ **Scalability**: Add new domains without bloating existing files
✅ **Maintainability**: Changes are isolated to specific domains
✅ **Code Review**: Smaller, focused files are easier to review
✅ **Team Collaboration**: Multiple developers can work on different domains
✅ **Documentation**: Each file is self-documenting with clear purpose
✅ **Production Ready**: Follows industry best practices

## Migration Steps

### Step 1: Backup (Optional)

```bash
# If you want to keep the old files temporarily
cd server/src/db/schema
mkdir _old_backup
cp tables.js _old_backup/
cp relations.js _old_backup/
```

### Step 2: Check all files that import from schema:

**Before:**

```javascript
import { products, customers, orders } from './db/schema/tables.js';
```

**After:**

```javascript
// Option 1: Import from main index (recommended)
import { products, customers, orders } from './db/schema/index.js';

// Option 2: Import from specific domains
import { products } from './db/schema/products/products.js';
import { customers } from './db/schema/sales/customers.js';
import { orders } from './db/schema/sales/orders.js';

// Option 3: Import entire schema (for Drizzle instance)
import * as schema from './db/schema/index.js';
```

### Step 3: Update Database Connection

**Before:**

```javascript
import * as schema from './schema/tables.js';
const db = drizzle(pool, { schema });
```

**After:**

```javascript
// No change needed! Same import works
import * as schema from './schema/index.js';
const db = drizzle(pool, { schema });
```

### Step 4: Update Type Imports

**Before:**

```typescript
import { products } from './db/schema/tables.js';
type Product = typeof products.$inferSelect;
```

**After:**

```typescript
// Same! No change needed
import { products } from './db/schema/index.js';
type Product = typeof products.$inferSelect;
```

### Step 5: Remove Old Files

Once everything is working:

```bash
cd server/src/db/schema
rm tables.js
rm relations.js
```

## Common Migration Issues

### Issue 1: Cannot Find Export

**Error:**

```
Module '"./db/schema/index.js"' has no exported member 'someTable'
```

**Solution:**
Check that the table is exported in its domain's `index.js` file.

### Issue 2: Circular Dependency

**Error:**

```
ReferenceError: Cannot access 'employees' before initialization
```

**Solution:**
This shouldn't happen with the new structure, but if it does, check import order in `cross-domain-relations.js`.

### Issue 3: Relations Not Working

**Problem:**
Queries don't include expected relations.

**Solution:**

1. Ensure you're importing from `schema/index.js` (includes all relations)
2. Check that cross-domain relations are defined
3. Verify both sides of bidirectional relations exist

## Updating Module Imports

### API Routes

```javascript
// Before
import { products, customers } from '../db/schema/tables.js';

// After
import { products, customers } from '../db/schema/index.js';
```

```javascript
// Before
import * as tables from '../db/schema/tables.js';

// After
import * as schema from '../db/schema/index.js';
// or
import { products } from '../db/schema/products/index.js';
```

### Test Files

```javascript
// Before
import { products, orders } from '../../src/db/schema/tables.js';

// After
import { products, orders } from '../../src/db/schema/index.js';
```

## Verification Checklist

After migration, verify:

- [ ] Application starts without errors
- [ ] All database queries work correctly
- [ ] Relations are properly populated in query results
- [ ] TypeScript types are correctly inferred
- [ ] No import errors in any files
- [ ] Tests pass
- [ ] Can generate new migrations with `npm run db:generate`
- [ ] Drizzle Studio works: `npm run db:studio`

## Testing the Migration

### 1. Unit Tests

```bash
npm test
```

### 2. Database Connection

```bash
npm run db:studio
# Opens Drizzle Studio - verify all tables are visible
```

### 3. Query Test

```javascript
// Test a cross-domain query
const result = await db.query.orders.findFirst({
  with: {
    customer: true,
    salesperson: true,
    orderDetails: {
      with: {
        product: true,
      },
    },
  },
});
console.log(result); // Should include all relations
```

## Rollback Plan

If you need to rollback:

1. **Restore old files:**

   ```bash
   cd server/src/db/schema
   cp _old_backup/tables.js .
   cp _old_backup/relations.js .
   ```

2. **Update index.js:**

   ```javascript
   export * from './tables.js';
   export * from './relations.js';
   ```

3. **Delete new structure:**

   ```bash
   rm -rf core/ products/ organization/ sales/ production/ inventory/ auth/
   rm cross-domain-relations.js README.md MIGRATION.md
   ```

4. **Restart application and test**

## Next Steps

After successful migration:

1. **Update documentation** with new import patterns
2. **Train team members** on new structure
3. **Update coding standards** to reference new organization
4. **Consider adding** domain-specific validation logic
5. **Explore** further modularization (e.g., domain services)

## Questions?

Refer to `README.md` in the schema directory for:

- Detailed domain explanations
- Usage examples
- Best practices
- Troubleshooting guide

## Schema Comparison

### Table Count

- **Old**: 2 files (tables + relations)
- **New**: 37 files organized in 7 domains

### Lines of Code

- **Old**: ~617 lines in 2 files
- **New**: Same content, distributed across focused files

### Maintainability

- **Old**: Find one table among 380 lines
- **New**: Navigate directly to domain folder

---

**Migration Complete!** 🎉

Your schema is now organized following production-grade best practices.
