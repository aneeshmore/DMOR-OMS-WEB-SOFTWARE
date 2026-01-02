# Database Schema Documentation

## Overview

This directory contains the complete database schema for the DMOR Paints Order Management System. The schema is organized into domain-specific modules following industry best practices for maintainability, scalability, and code organization.

## Architecture Principles

1. **Domain-Driven Design**: Schemas are organized by business domain (products, sales, inventory, etc.)
2. **Separation of Concerns**: Each module handles a specific area of the application
3. **Single Responsibility**: Each file contains one table definition or related set of relations
4. **Clear Dependencies**: Import structure clearly shows relationships between domains
5. **Production-Ready**: Includes proper documentation, type safety, and referential integrity

## Directory Structure

```
schema/
├── index.js                      # Main entry point - exports all schemas
├── cross-domain-relations.js     # Relations spanning multiple domains
├── generate-schema-files.js      # Auto-generator for tables.js and relations.js
├── tables.js                     # Auto-generated - all table exports
├── relations.js                  # Auto-generated - all relation exports
│
├── core/                         # Core application schemas
│   ├── index.js
│   ├── app-schema.js            # PostgreSQL schema definition
│   ├── units.js                 # Measurement units
│   ├── vehicles.js              # Delivery vehicles
│   └── relations.js
│
├── products/                     # Product management schemas
│   ├── index.js
│   ├── master-products.js       # Parent product definitions
│   ├── master-product-fg.js     # Finished goods subtype
│   ├── master-product-rm.js     # Raw materials subtype
│   ├── master-product-pm.js     # Packaging materials subtype
│   ├── products.js              # SKU-level products
│   ├── product-bom.js           # Bill of materials
│   └── relations.js
│
├── organization/                 # Organizational structure
│   ├── index.js
│   ├── branches.js              # Company branches/locations
│   ├── departments.js           # Organizational departments
│   ├── designations.js          # Job titles/positions
│   ├── employees.js             # Employee records
│   └── relations.js
│
├── sales/                        # Sales and customer management
│   ├── index.js
│   ├── customers.js             # Customer records
│   ├── orders.js                # Sales orders
│   ├── order-details.js         # Order line items
│   └── relations.js
│
├── production/                   # Manufacturing processes
│   ├── index.js
│   ├── production-batch.js      # Production batches
│   └── relations.js
│
├── inventory/                    # Inventory management
│   ├── index.js
│   ├── material-inward.js       # Incoming materials
│   ├── material-discard.js      # Discarded materials
│   ├── stock-ledger.js          # Inventory audit trail
│   └── relations.js
│
└── auth/                         # Authentication & authorization
    ├── index.js
    ├── roles.js                 # User roles
    ├── permissions.js           # System permissions
    ├── role-permissions.js      # Role-permission mapping
    ├── employee-roles.js        # Employee-role assignments
    └── relations.js
```

## Schema Domains

### Core Domain

**Purpose**: Foundational schemas used across the application

- **app-schema.js**: Defines the PostgreSQL `app` schema namespace
- **units.js**: Measurement units (kg, liters, pieces, etc.)
- **vehicles.js**: Delivery and transport vehicles

### Products Domain

**Purpose**: Product catalog and composition management

- **master-products.js**: Parent table for all product types
- **master-product-fg/rm/pm.js**: Type-specific attributes (polymorphic pattern)
- **products.js**: SKU-level sellable items
- **product-bom.js**: Bill of materials for finished goods

**Design Pattern**: Uses table inheritance pattern where master products have type-specific subtypes.

### Organization Domain

**Purpose**: Company structure and employee management

- **branches.js**: Physical company locations
- **departments.js**: Organizational units
- **designations.js**: Job positions/titles
- **employees.js**: Employee master data

**Key Relationships**:

- Departments can have department heads (employees)
- Employees belong to departments and designations
- Employees are assigned to branches

### Sales Domain

**Purpose**: Customer relationship and order management

- **customers.js**: Customer/client master data
- **orders.js**: Sales order headers
- **order-details.js**: Order line items

**Business Rules**:

- Orders are linked to customers
- Each order can have multiple line items
- Orders track payment and delivery status

### Production Domain

**Purpose**: Manufacturing and production tracking

- **production-batch.js**: Production runs and batches

**Features**:

- Links to products being manufactured
- Associates with source orders
- Tracks production supervisors
- Records actual vs planned quantities

### Inventory Domain

**Purpose**: Stock movements and inventory control

- **material-inward.js**: Incoming stock transactions
- **material-discard.js**: Waste/discard tracking
- **stock-ledger.js**: Complete audit trail

**Audit Trail**: Stock ledger maintains complete history of all inventory changes with reference tracking.

### Auth Domain

**Purpose**: Role-based access control (RBAC)

- **roles.js**: User role definitions
- **permissions.js**: System permission catalog
- **role-permissions.js**: Maps permissions to roles with CRUD flags
- **employee-roles.js**: Assigns roles to employees

**Access Control Model**:

- Permissions define what can be accessed
- Roles group permissions together
- Role permissions specify CRUD operations (Create, Read, Update, Delete/Lock)
- Employees are assigned one or more roles

## Cross-Domain Relations

The `cross-domain-relations.js` file handles relationships that span multiple business domains:

- Employees → Customers (as sales persons)
- Employees → Orders (as sales persons)
- Employees → Production Batches (as supervisors)
- Products → Orders (order line items)
- Products → Inventory transactions
- Employees → Auth (role assignments)

**Important**: This file must be imported last to ensure all table definitions are available.

## Auto-Generated Files

### tables.js and relations.js

These files are **automatically generated** by the `generate-schema-files.js` script and should **not be edited manually**.

**Purpose**:

- `tables.js`: Consolidates all table exports from subdirectories
- `relations.js`: Consolidates all relation exports from subdirectories

**Generation**:

```bash
# Generate both files
npm run schema:generate

# Or run directly
node src/db/schema/generate-schema-files.js
```

**What Gets Generated**:

- Scans all subdirectories (`auth/`, `core/`, `inventory/`, `organization/`, `production/`, `products/`, `sales/`)
- Extracts all table definitions (matching `export const X = appSchema.table(...)`)
- Extracts all relation definitions (matching `export const X = relations(...)`)
- Creates clean export statements with proper relative paths
- Adds timestamps and DO NOT EDIT warnings

**Git Ignore**:
These files are added to `.gitignore` since they can be regenerated at any time from the source schema files.

**When to Regenerate**:

- After adding a new table file
- After adding a new relation file
- After renaming tables or relations
- As part of your build/deployment process

## Usage Examples

### Importing the Complete Schema

```javascript
// Import everything
import * as schema from './db/schema/index.js';

// Use with Drizzle ORM
const db = drizzle(pool, { schema });
```

### Importing from Auto-Generated Files

```javascript
// Import all tables at once
import * as tables from './db/schema/tables.js';

// Import all relations at once
import * as relations from './db/schema/relations.js';

// Use with Drizzle
const db = drizzle(pool, { schema: { ...tables, ...relations } });
```

### Importing Specific Domains

```javascript
// Import only products domain
import * as products from './db/schema/products/index.js';

// Import only organization domain
import * as org from './db/schema/organization/index.js';
```

### Importing Individual Tables

```javascript
// Import specific tables
import { employees } from './db/schema/organization/employees.js';
import { products } from './db/schema/products/products.js';
import { orders } from './db/schema/sales/orders.js';
```

## Database Schema (PostgreSQL)

All tables are created under the `app` schema in PostgreSQL:

```sql
CREATE SCHEMA IF NOT EXISTS app;
```

Tables are referenced as: `app.employees`, `app.products`, etc.

## Migration Workflow

When making schema changes:

1. **Modify the appropriate domain file** (e.g., `products/products.js`)
2. **Update relations if needed** (in the same domain's `relations.js`)
3. **Add cross-domain relations** if linking to other domains
4. **Regenerate auto-files**: `npm run schema:generate` (updates tables.js & relations.js)
5. **Generate migration**: Use Drizzle Kit to generate migration files
6. **Review migration**: Check generated SQL for correctness
7. **Apply migration**: Run migrations against database

```bash
# Regenerate schema exports
npm run schema:generate

# Generate migration
npm run db:generate

# Apply migration
npm run db:migrate
```

## Best Practices

### File Organization

- ✅ One table per file
- ✅ Group related tables in domain folders
- ✅ Separate relations from table definitions
- ✅ Use descriptive file names (kebab-case)

### Code Style

- ✅ Include JSDoc comments for each file
- ✅ Document business rules and constraints
- ✅ Use consistent naming conventions
- ✅ Export only what's needed

### Schema Design

- ✅ Use proper foreign key constraints
- ✅ Set appropriate `onDelete` actions
- ✅ Use `timestamp with timezone` for dates
- ✅ Define defaults for non-null fields
- ✅ Use `serial` for auto-increment primary keys
- ✅ Use `uuid` for public-facing identifiers

### Relationships

- ✅ Define bidirectional relations where appropriate
- ✅ Use descriptive relation names
- ✅ Keep domain relations separate from cross-domain
- ✅ Document complex relationships

## Common Patterns

### Soft Deletes

```javascript
isActive: boolean('is_active').notNull().default(true),
```

### Audit Timestamps

```javascript
createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
```

### UUID for External References

```javascript
productUuid: uuid('product_uuid').defaultRandom().notNull(),
```

### Polymorphic Associations

See `products/` domain for table inheritance pattern.

## Troubleshooting

### Circular Dependencies

If you encounter circular dependency errors:

1. Check import order in `index.js`
2. Move cross-domain relations to `cross-domain-relations.js`
3. Ensure tables are defined before relations reference them

### Missing Relations

If queries don't return expected relations:

1. Verify relation is defined in appropriate `relations.js`
2. Check that both sides of bidirectional relations are defined
3. Ensure `cross-domain-relations.js` is imported

### Type Errors

If TypeScript/Drizzle types are incorrect:

1. Ensure all exports are present in `index.js` files
2. Check that schema is properly passed to Drizzle instance

### Adding a New Domain

1. Create new folder: `schema/new-domain/`
2. Add table files with proper exports
3. Create `relations.js` for internal relations
4. Create `index.js` to export all
5. Add domain name to `SCHEMA_SUBDIRS` in `generate-schema-files.js`
6. Add to main `schema/index.js`
7. Add cross-domain relations if needed
8. Run `npm run schema:generate` to update auto-generated files

### Adding a New Table

1. Create table file in appropriate domain
2. Export from domain's `index.js`
3. Add relations to domain's `relations.js`
4. Add cross-domain relations if needed
5. Run `npm run schema:generate` to update tables.js/relations.js
6. Generate and run migration

### Modifying Existing Tables

1. Update table definition
2. Update related relations
3. Run `npm run schema:generate` if exports changed
4. Generate migration
5. Review for breaking changes
6. Plan deployment strategy
7. Update related relations
8. Generate migration
9. Review for breaking changes
10. Plan deployment strategy

## Security Considerations

- **Passwords**: Always store hashed (see `employees.passwordHash`)
- **Soft Deletes**: Use `isActive` flags instead of hard deletes

## Performance Tips

- **Indexes**: Add indexes to frequently queried foreign keys
- **Partitioning**: Consider partitioning large tables (orders, stock_ledger)
- **Materialized Views**: Use for complex reporting queries
- **Connection Pooling**: Configure appropriate pool sizes
- **Query Optimization**: Use Drizzle's query builder efficiently

## Automation & Build Process

### Pre-commit Hook (Recommended)

Add to `.git/hooks/pre-commit` to auto-regenerate schema files:

```bash
#!/bin/bash
npm run schema:generate
git add src/db/schema/tables.js src/db/schema/relations.js
```

### CI/CD Integration

Add to your build pipeline:

```bash
# Verify auto-generated files are up-to-date
npm run schema:generate
if ! git diff --exit-code src/db/schema/tables.js src/db/schema/relations.js; then
  echo "Error: tables.js or relations.js out of date. Run npm run schema:generate"
  exit 1
fi
```

### NPM Scripts

Available commands:

```bash
npm run schema:generate    # Generate tables.js and relations.js
npm run db:generate        # Generate Drizzle migration files
npm run db:migrate         # Apply migrations
npm run db:push            # Push schema directly (dev only)
npm run db:studio          # Open Drizzle Studio
npm run db:seed            # Seed database
npm run db:init            # Drop, recreate, and seed database
```

- **Partitioning**: Consider partitioning large tables (orders, stock_ledger)
- **Materialized Views**: Use for complex reporting queries
- **Connection Pooling**: Configure appropriate pool sizes
- **Query Optimization**: Use Drizzle's query builder efficiently

## References

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Database Design Best Practices](https://www.postgresql.org/docs/current/ddl.html)

---

**Last Updated**: December 2025  
**Schema Version**: 1.0.0  
**Drizzle ORM Version**: Compatible with latest
