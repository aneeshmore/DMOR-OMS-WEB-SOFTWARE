# Production Flow Management System - Complete Design Document

## Executive Summary

This document outlines the complete database design, user workflows, and implementation plan for a production-ready Paint Manufacturing Order Management System with integrated production planning, batch scheduling, and inventory management.

---

## Table of Contents

1. [Current System Analysis](#current-system-analysis)
2. [Business Requirements](#business-requirements)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Complete Workflow](#complete-workflow)
5. [Database Schema Design](#database-schema-design)
6. [Product Development Form](#product-development-form)
7. [BOM Production Module](#bom-production-module)
8. [Batch Management Dashboard](#batch-management-dashboard)
9. [API Endpoints Design](#api-endpoints-design)
10. [UI/UX Specifications](#uiux-specifications)
11. [Implementation Phases](#implementation-phases)
12. [Technical Specifications](#technical-specifications)

---

## 1. Current System Analysis

### Existing Tables Audit

#### Sales Domain

- **orders**: Basic order information (customer, salesperson, dates, status)
- **order_details**: Line items with products, quantities, pricing, discount
- **accounts**: Payment and billing tracking (accountant managed)
- **customers**: Customer master data

#### Inventory Domain

- **products**: Finished goods (FG) and raw materials (RM)
- **inventory**: Current stock levels
- **product_bom**: Bill of Materials for FG production

#### Production Domain

- **production_batch**: Basic batch tracking (EXISTS but underutilized)

#### HR Domain

- **employees**: User accounts with department and role assignment
- **departments**: Organizational units

### Current Gaps Identified

1. ❌ No order-to-production workflow
2. ❌ No batch scheduling mechanism
3. ❌ No batch-to-order mapping
4. ❌ No raw material consumption tracking per batch
5. ❌ No batch completion data capture
6. ❌ No production status tracking
7. ❌ No inventory reservation system
8. ❌ No batch chart generation

---

## 2. Business Requirements

### Core Workflow Requirements

```
Order Created (Sales)
    ↓
Payment Verified (Accountant)
    ↓
Production Assessment (Production Manager)
    ↓
    ├─→ [Stock Available] → Direct to Dispatch
    │
    └─→ [Stock Unavailable] → Batch Scheduling
            ↓
        Batch Created & Scheduled
            ↓
        Raw Material Check
            ↓
        Batch Production (Supervisor)
            ↓
        Batch Completion Data Entry
            ↓
        Inventory Update
            ↓
        Ready for Dispatch
```

### Detailed Requirements

#### R1: Order Acceptance by Accountant

- View pending orders
- Verify payment details
- Update bill number, payment status (check rm an fg as soon as payment get cleared status checked and saved, and if any low material availability found then trigger high level notification to admin and production manager)
- Accept/Hold/Reject order
- Add accounting remarks

#### R2: Production Manager Assessment

- View accepted orders
- Check inventory availability for each product
- Decision: **Dispatch Now** OR **Schedule Production**

#### R3: Batch Scheduling (If production needed)

- Consolidate multiple orders for same product
- Group by master product
- Calculate total quantity required
- Check raw material availability
- Assign scheduled production date
- Generate batch number (e.g., B238-12-2025)

#### R4: Batch Chart View

- Display all batches (Scheduled, In Progress, Completed)
- Filter by date, product, status
- View batch details:
  - Customer-wise orders in batch
  - Total quantity by product
  - Raw materials required (from BOM)
  - Available vs. Required raw materials

#### R5: Start Production

- Production supervisor starts batch
- System validates raw material availability
- Status changes to "In Progress"
- Export/Print batch chart with:
  - Batch number, date, supervisor
  - Product details
  - Raw material list with quantities
  - Customer order references
  - Fields for manual data entry (density, actual qty, etc.)

#### R6: Complete Production

- Supervisor marks batch complete
- Enter actual production data:
  - Actual quantity produced
  - Actual density
  - Production time (start/end)
  - Water percentage
  - Viscosity
- System updates:
  - Deduct raw materials from inventory
  - Add finished goods to inventory
  - Update order status
  - Mark items ready for dispatch

#### R7: Dispatch Management

- View orders ready for dispatch
- Generate delivery challan
- Update order status to "Dispatched"
- Track delivery

---

## 3. User Roles & Permissions(Production Manager and Production Supervisor are same only Production Manager in production dept)

### Role Matrix

| Feature           | Sales | Accountant | Production Manager | Production Supervisor | Dispatch | Admin |
| ----------------- | ----- | ---------- | ------------------ | --------------------- | -------- | ----- |
| Create Order      | ✅    | ❌         | ❌                 | ❌                    | ❌       | ✅    |
| View Orders       | Own   | ✅         | ✅                 | ✅                    | ✅       | ✅    |
| Accept/Hold Order | ❌    | ✅         | ❌                 | ❌                    | ❌       | ✅    |
| Check Inventory   | ❌    | ❌         | ✅                 | ✅                    | ❌       | ✅    |
| Schedule Batch    | ❌    | ❌         | ✅                 | ❌                    | ❌       | ✅    |
| Start Batch       | ❌    | ❌         | ❌                 | ✅                    | ❌       | ✅    |
| Complete Batch    | ❌    | ❌         | ❌                 | ✅                    | ❌       | ✅    |
| Dispatch Order    | ❌    | ❌         | ❌                 | ❌                    | ✅       | ✅    |
| Manage Inventory  | ❌    | ❌         | ✅                 | ❌                    | ❌       | ✅    |

---

## 4. Complete Workflow

### 4.1 Order Creation (Salesperson)

**User Story:**

> As a salesperson, I want to create an order with multiple products, apply discounts, and specify delivery details so that customers can purchase our products.

**Steps:**

1. Navigate to Create Order page
2. Select customer from dropdown
3. Auto-populate delivery address
4. Add order line items:
   - Select product
   - Enter quantity
   - Unit price (editable)
   - Apply discount percentage
5. System calculates line totals and order total
6. Add remarks if needed
7. Submit order
8. Order created with status: **"Pending"**

**Validations:**

- ✅ Customer must be selected
- ✅ At least one line item required
- ✅ Quantity > 0
- ✅ Unit price > 0
- ✅ Discount 0-20%

---

### 4.2 Order Acceptance (Accountant)

**User Story:**

> As an accountant, I want to review pending orders, verify payment information, and accept orders for production so that only paid orders proceed to manufacturing.

**UI Requirements:**

- Orders Dashboard filtered by status "Pending"
- Click order to open details modal
- Form fields:
  - Bill Number (auto-generated or manual)
  - Bill Date (default: today)
  - Bill Amount (pre-filled from order total, editable)
  - Payment Status (Pending/Partial/Cleared/Overdue)
  - Payment Method (Cash/Card/UPI/Bank Transfer/Cheque)(optional)
  - Payment Reference (Transaction ID) (optional)
  - Payment Date(optional)
  - Accountant Remarks(optional)
- Actions: **Accept Order** | **Hold** | **Reject**

**Backend Logic:**

```javascript
acceptOrder(orderId, accountData) {
  // 1. Update accounts table
  await db.update(accounts)
    .set({
      billNo: accountData.billNo,
      billDate: accountData.billDate,
      billAmount: accountData.billAmount,
      paymentStatus: accountData.paymentStatus,
      paymentCleared: accountData.paymentStatus === 'Cleared',
      paymentMethod: accountData.paymentMethod,
      paymentReference: accountData.paymentReference,
      paymentDate: accountData.paymentDate,
      accountantId: currentUser.employeeId,
      processedDate: new Date(),
      remarks: accountData.remarks
    })
    .where(eq(accounts.orderId, orderId));

  // 2. Update order status
  await db.update(orders)
    .set({
      status: 'Accepted',
      updatedAt: new Date()
    })
    .where(eq(orders.orderId, orderId));

  return { success: true };
}
```

**Order Status after acceptance:** **"Accepted"**

---

### 4.3 Production Assessment (Production Manager)

**User Story:**

> As a production manager, I want to review accepted orders, check inventory availability, and either dispatch immediately or schedule production batches based on stock levels.

**UI: Production Dashboard**

**Tab 1: Pending Orders (Status = "Accepted")**

Display table with columns:

- Order ID
- Customer Name
- Products (list)
- Total Quantity
- Priority
- Order Date
- Actions: [View Details] [Check Inventory]

**Inventory Check Modal:**

```
Order #1234 - ABC Paints Ltd.

┌────────────────────────────────────────────────────────┐
│ Product                  │ Ordered │ Available │ Status │
├────────────────────────────────────────────────────────┤
│ Black Japan 1L          │ 99      │ 150       │ ✅ OK   │
│ Black SE Glossy 500ml   │ 231     │ 50        │ ❌ Low  │
│ Black Paint 2nd 1L      │ 551     │ 0         │ ❌ Out  │
└────────────────────────────────────────────────────────┘

[Dispatch Available Items] [Schedule Production for All]
```

**Backend Logic:**

```javascript
checkInventoryAvailability(orderId) {
  // Get order details
  const orderItems = await db
    .select()
    .from(orderDetails)
    .where(eq(orderDetails.orderId, orderId));

  // Check inventory for each product
  const availability = [];
  for (const item of orderItems) {
    const stock = await db
      .select({ availableQty: inventory.availableQty })
      .from(inventory)
      .where(eq(inventory.productId, item.productId))
      .limit(1);

    availability.push({
      productId: item.productId,
      productName: item.productName,
      orderedQty: item.quantity,
      availableQty: stock[0]?.availableQty || 0,
      status: (stock[0]?.availableQty || 0) >= item.quantity ? 'available' : 'insufficient'
    });
  }

  return availability;
}
```

**Decision Actions:**

**Option A: Dispatch Immediately**

- If ALL products have sufficient stock
- Update order status to **"Ready for Dispatch"**
- Reserve inventory for this order

**Option B: Schedule Production**

- If ANY product has insufficient stock
- Open Batch Scheduling interface

---

### 4.4 Batch Scheduling (Production Manager)

**User Story:**

> As a production manager, I want to create production batches by consolidating multiple orders for the same products, schedule production dates, and ensure raw materials are available.

**UI: Batch Scheduler**

**Step 1: Select Orders for Batch**

- Multi-select orders (checkbox)
- Filter by product, customer, priority
- Shows orders with status "Accepted"

**Step 2: Batch Planning View**

Group selected orders by **Master Product**:

```
┌─ Batch Planning ─────────────────────────────────────┐
│                                                      │
│ Product: BLACK JAPAN 1 LTR                           │
│ Total Required: 550.00 Liters                        │
│                                                      │
│ Orders in this batch:                                │
│ • Order #1234 - ABC Paints (99 L)                    │
│ • Order #1235 - XYZ Industries (200 L)               │
│ • Order #1240 - Ganesh Traders (251 L)               │
│                                                       │
│ Raw Materials Required (from BOM):                    │
│ ┌─────────────────────────────────────────────────┐   │
│ │ Material          │ Required │ Available │ Status│  │
│ ├─────────────────────────────────────────────────┤   │
│ │ Xylene           │ 26.67 kg │ 28.49 kg │ ✅ OK  │  │
│ │ PU Resin 920     │ 55.00 kg │ 35.00 kg │ ❌ Low │  │
│ │ Carbon Black     │ 5.00 kg  │ 0.01 kg  │ ❌ Out │  │
│ └─────────────────────────────────────────────────┘  │
│                                                      │
│ Scheduled Date: [___________] (Date Picker)          │
│ Production Qty: [550.00] (Auto-calculated, editable) │
│ Density: [1.10] kg/L                                 │
│ Water %: [0.00]                                      │
│                                                      │
│ [Check Raw Material] [Create Batch]                  │
└────────────────────────────────────────────────────────┘
```

**Backend Logic:**

```javascript
createProductionBatch(batchData) {
  const tx = await db.transaction(async (trx) => {
    // 1. Generate batch number
    const batchNo = generateBatchNo(batchData.scheduledDate); // B238-12-2025

    // 2. Create batch record
    const batch = await trx.insert(productionBatches).values({
      batchNo,
      masterProductId: batchData.masterProductId,
      scheduledDate: batchData.scheduledDate,
      plannedQuantity: batchData.totalQuantity,
      density: batchData.density,
      waterPercentage: batchData.waterPercentage,
      status: 'Scheduled',
      productionManagerId: currentUser.employeeId,
      createdAt: new Date()
    }).returning();

    // 3. Link orders to batch
    for (const orderId of batchData.orderIds) {
      await trx.insert(batchOrders).values({
        batchId: batch[0].batchId,
        orderId,
        productId: batchData.masterProductId,
        quantity: getOrderQuantity(orderId, batchData.masterProductId)
      });
    }

    // 4. Calculate and store raw material requirements
    const bom = await getBOM(batchData.masterProductId);
    for (const material of bom) {
      const requiredQty = calculateMaterialQty(
        batchData.totalQuantity,
        batchData.density,
        material.percentage
      );

      await trx.insert(batchMaterials).values({
        batchId: batch[0].batchId,
        materialId: material.rawMaterialId,
        requiredQuantity: requiredQty,
        requiredUsePer: material.usePer,
        requiredUseQty: material.useQty
      });
    }

    // 5. Update order statuses
    await trx.update(orders)
      .set({ status: 'In Production Planning' })
      .where(inArray(orders.orderId, batchData.orderIds));

    return batch[0];
  });

  return tx;
}
```

**Batch Number Format:** `B<DayOfYear>-<Month>-<Year>`

- Example: B238-12-2025 (238th day of 2025, December)

---

### 4.5 Batch Chart View (Production Supervisor)

**User Story:**

> As a production supervisor, I want to view all scheduled batches, see detailed requirements, and start production when ready.

**UI: Production Batches Dashboard**

**Filters:**

- Status: All / Scheduled / In Progress / Completed
- Date Range
- Product
- Supervisor

**Batch Card View:**

```
┌─ Batch B238-12-2025 ───────────────────────────────────┐
│ Status: Scheduled                                       │
│ Product: BLACK JAPAN 1 LTR                             │
│ Planned Qty: 550.00 L                                  │
│ Scheduled: Dec 12, 2025                                │
│ Density: 1.10 kg/L                                     │
│                                                         │
│ Customer Orders (3):                                   │
│ • ABC Paints Ltd - 99 L                                │
│ • XYZ Industries - 200 L                               │
│ • Ganesh Traders - 251 L                               │
│                                                         │
│ [View Full Details] [Export Batch Chart] [Start Batch] │
└─────────────────────────────────────────────────────────┘
```

**Batch Detail Modal:**

Shows complete information matching the attached images:

**Section 1: Header**

- Batch No
- Date
- Supervisor Name
- Product Details
- Production Qty
- Density
- Water %
- Viscosity

**Section 2: Raw Materials Table**

| Product      | UsePer | UseQty | Check |
| ------------ | ------ | ------ | ----- |
| Xylene       | 25.49  | 28.67  | ✅    |
| PU Resin 920 | 55.54  | 35.00  | ❌    |
| Carbon Black | 0.01   | 0.00   | ❌    |
| ...          | ...    | ...    | ...   |

**Section 3: Sub-Products Table**

| Product               | QTY | LTR | KG  |
| --------------------- | --- | --- | --- |
| BLACK JAPAN 1 LTR     | 99  |     |     |
| BLACK JAPAN 20 LTR    | -9  |     |     |
| BLACK SE GLOSSY 500ml | 231 |     |     |
| ...                   | ... | ... | ... |

**Section 4: Production Tracking**

| Product            | APP QTY | BATCH QTY | DISPATCH QTY | TOTAL | ACTUAL QTY | DIFFERENCE |
| ------------------ | ------- | --------- | ------------ | ----- | ---------- | ---------- |
| BLACK JAPAN 1 LTR  | 99.00   |           |              |       |            |            |
| BLACK JAPAN 20 LTR | -9.00   |           |              |       |            |            |
| ...                | ...     | ...       | ...          | ...   | ...        | ...        |

**Actions:**

- Export as PDF
- Print Batch Chart
- Start Production

---

### 4.6 Start Production

**User Story:**

> As a production supervisor, I want to start a batch and have the system validate material availability before proceeding.

**Backend Logic:**

```javascript
async startBatch(batchId, supervisorId) {
  const tx = await db.transaction(async (trx) => {
    // 1. Get batch details
    const batch = await getBatchDetails(batchId);

    // 2. Validate raw material availability
    const materials = await trx
      .select()
      .from(batchMaterials)
      .where(eq(batchMaterials.batchId, batchId));

    const validationErrors = [];
    for (const material of materials) {
      const inventory = await trx
        .select({ availableQty: inventory.availableQty })
        .from(inventory)
        .where(eq(inventory.productId, material.materialId))
        .limit(1);

      if (!inventory[0] || inventory[0].availableQty < material.requiredQuantity) {
        validationErrors.push({
          materialId: material.materialId,
          required: material.requiredQuantity,
          available: inventory[0]?.availableQty || 0
        });
      }
    }

    if (validationErrors.length > 0) {
      throw new Error('Insufficient raw materials', { validationErrors });
    }

    // 3. Update batch status
    await trx.update(productionBatches)
      .set({
        status: 'In Progress',
        supervisorId,
        startedAt: new Date()
      })
      .where(eq(productionBatches.batchId, batchId));

    // 4. Reserve raw materials
    for (const material of materials) {
      await trx.update(inventory)
        .set({
          reservedQty: sql`${inventory.reservedQty} + ${material.requiredQuantity}`
        })
        .where(eq(inventory.productId, material.materialId));
    }

    return { success: true, batchId };
  });

  return tx;
}
```

**Status Updates:**

- Batch: **"In Progress"**
- Linked Orders: **"In Production"**

---

### 4.7 Complete Production

**User Story:**

> As a production supervisor, after completing a batch, I want to enter actual production data from the physical batch chart so the system can update inventory and mark orders ready for dispatch.

**UI: Complete Batch Form**

```
┌─ Complete Batch B238-12-2025 ─────────────────────────┐
│                                                         │
│ Production Details:                                    │
│ Actual Quantity Produced: [____] L                     │
│ Actual Density: [____] kg/L                            │
│ Actual Water %: [____]                                 │
│ Actual Viscosity: [____]                               │
│                                                         │
│ Production Times:                                      │
│ Start Date/Time: [__________] [__:__]                 │
│ End Date/Time: [__________] [__:__]                   │
│ Total Hours: 6.58 (Auto-calculated)                   │
│                                                         │
│ Labours: GANESH AND ROHIDAS                            │
│                                                         │
│ Actual Material Consumption:                           │
│ ┌────────────────────────────────────────────────┐    │
│ │ Material        │ Planned │ Actual │ Variance  │    │
│ ├────────────────────────────────────────────────┤    │
│ │ Xylene         │ 26.67   │ [____] │ [Auto]    │    │
│ │ PU Resin 920   │ 55.00   │ [____] │ [Auto]    │    │
│ │ Carbon Black   │ 5.00    │ [____] │ [Auto]    │    │
│ └────────────────────────────────────────────────┘    │
│                                                         │
│ Production Remarks:                                    │
│ [_________________________________________________]    │
│                                                         │
│ [Cancel] [Complete Batch]                              │
└─────────────────────────────────────────────────────────┘
```

**Backend Logic:**

```javascript
async completeBatch(batchId, completionData) {
  const tx = await db.transaction(async (trx) => {
    const batch = await getBatchDetails(batchId);

    // 1. Update batch with actual data
    await trx.update(productionBatches)
      .set({
        status: 'Completed',
        actualQuantity: completionData.actualQuantity,
        actualDensity: completionData.actualDensity,
        actualWaterPercentage: completionData.actualWaterPercentage,
        actualViscosity: completionData.actualViscosity,
        startedAt: completionData.startDateTime,
        completedAt: completionData.endDateTime,
        labourNames: completionData.labourNames,
        productionRemarks: completionData.remarks,
        completedBy: currentUser.employeeId
      })
      .where(eq(productionBatches.batchId, batchId));

    // 2. Update actual material consumption
    for (const material of completionData.actualMaterials) {
      await trx.update(batchMaterials)
        .set({
          actualQuantity: material.actualQuantity,
          variance: material.actualQuantity - material.plannedQuantity
        })
        .where(and(
          eq(batchMaterials.batchId, batchId),
          eq(batchMaterials.materialId, material.materialId)
        ));
    }

    // 3. Deduct raw materials from inventory
    for (const material of completionData.actualMaterials) {
      await trx.update(inventory)
        .set({
          availableQty: sql`${inventory.availableQty} - ${material.actualQuantity}`,
          reservedQty: sql`${inventory.reservedQty} - ${material.plannedQuantity}`,
          updatedAt: new Date()
        })
        .where(eq(inventory.productId, material.materialId));

      // Log transaction
      await trx.insert(inventoryTransactions).values({
        productId: material.materialId,
        transactionType: 'Production Consumption',
        quantity: -material.actualQuantity,
        referenceType: 'Batch',
        referenceId: batchId,
        notes: `Batch ${batch.batchNo} - ${batch.productName}`,
        createdBy: currentUser.employeeId
      });
    }

    // 4. Add finished goods to inventory
    await trx.update(inventory)
      .set({
        availableQty: sql`${inventory.availableQty} + ${completionData.actualQuantity}`,
        updatedAt: new Date()
      })
      .where(eq(inventory.productId, batch.masterProductId));

    // Log FG transaction
    await trx.insert(inventoryTransactions).values({
      productId: batch.masterProductId,
      transactionType: 'Production Output',
      quantity: completionData.actualQuantity,
      referenceType: 'Batch',
      referenceId: batchId,
      notes: `Batch ${batch.batchNo} completed`,
      createdBy: currentUser.employeeId
    });

    // 5. Update linked orders
    const batchOrders = await trx
      .select()
      .from(batchOrders)
      .where(eq(batchOrders.batchId, batchId));

    for (const bo of batchOrders) {
      await trx.update(orders)
        .set({
          status: 'Ready for Dispatch',
          expectedDeliveryDate: addDays(new Date(), 2) // 2 days from now
        })
        .where(eq(orders.orderId, bo.orderId));
    }

    return { success: true, batchId };
  });

  return tx;
}
```

**Status Updates:**

- Batch: **"Completed"**
- Linked Orders: **"Ready for Dispatch"**
- Inventory: Raw materials deducted, FG added

---

## 5. Database Schema Design

### New Tables Required

#### 5.1 production_batches (Enhanced)

```javascript
export const productionBatches = appSchema.table('production_batches', {
  batchId: serial('batch_id').primaryKey(),
  batchNo: varchar('batch_no', { length: 50 }).notNull().unique(),
  batchUuid: uuid('batch_uuid').defaultRandom().notNull(),

  // Product Information
  masterProductId: integer('master_product_id')
    .notNull()
    .references(() => products.productId),

  // Planning Data
  scheduledDate: date('scheduled_date').notNull(),
  plannedQuantity: numeric('planned_quantity', { precision: 18, scale: 4 }).notNull(),
  density: numeric('density', { precision: 12, scale: 6 }),
  waterPercentage: numeric('water_percentage', { precision: 5, scale: 2 }),

  // Actual Production Data
  actualQuantity: numeric('actual_quantity', { precision: 18, scale: 4 }),
  actualDensity: numeric('actual_density', { precision: 12, scale: 6 }),
  actualWaterPercentage: numeric('actual_water_percentage', { precision: 5, scale: 2 }),
  actualViscosity: varchar('actual_viscosity', { length: 50 }),

  // Timing
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),

  // Personnel
  productionManagerId: integer('production_manager_id').references(() => employees.employeeId),
  supervisorId: integer('supervisor_id').references(() => employees.employeeId),
  labourNames: text('labour_names'),

  // Status
  status: varchar('status', { length: 20 }).notNull().default('Scheduled'),
  // Values: Scheduled, In Progress, Completed, Cancelled

  // Notes
  productionRemarks: text('production_remarks'),

  // Audit
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  completedBy: integer('completed_by').references(() => employees.employeeId),
});
```

#### 5.2 batch_orders (NEW - Junction Table)

```javascript
export const batchOrders = appSchema.table('batch_orders', {
  batchOrderId: serial('batch_order_id').primaryKey(),

  batchId: integer('batch_id')
    .notNull()
    .references(() => productionBatches.batchId, { onDelete: 'cascade' }),

  orderId: integer('order_id')
    .notNull()
    .references(() => orders.orderId, { onDelete: 'cascade' }),

  productId: integer('product_id')
    .notNull()
    .references(() => products.productId),

  quantity: numeric('quantity', { precision: 18, scale: 4 }).notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Composite unique constraint
// Prevents same order-product combination in multiple batches
```

#### 5.3 batch_materials (NEW - Raw Material Tracking)

```javascript
export const batchMaterials = appSchema.table('batch_materials', {
  batchMaterialId: serial('batch_material_id').primaryKey(),

  batchId: integer('batch_id')
    .notNull()
    .references(() => productionBatches.batchId, { onDelete: 'cascade' }),

  materialId: integer('material_id')
    .notNull()
    .references(() => products.productId), // Raw material product

  // Planned (from BOM calculation)
  requiredQuantity: numeric('required_quantity', { precision: 18, scale: 4 }).notNull(),
  requiredUsePer: numeric('required_use_per', { precision: 18, scale: 4 }),
  requiredUseQty: numeric('required_use_qty', { precision: 18, scale: 4 }),

  // Actual (entered at completion)
  actualQuantity: numeric('actual_quantity', { precision: 18, scale: 4 }),
  variance: numeric('variance', { precision: 18, scale: 4 }), // actual - required

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
```

#### 5.4 batch_sub_products (NEW - Sub-product tracking)

```javascript
export const batchSubProducts = appSchema.table('batch_sub_products', {
  batchSubProductId: serial('batch_sub_product_id').primaryKey(),

  batchId: integer('batch_id')
    .notNull()
    .references(() => productionBatches.batchId, { onDelete: 'cascade' }),

  productId: integer('product_id')
    .notNull()
    .references(() => products.productId),

  // From orders
  appQty: numeric('app_qty', { precision: 18, scale: 4 }),

  // Production tracking
  batchQty: numeric('batch_qty', { precision: 18, scale: 4 }),
  dispatchQty: numeric('dispatch_qty', { precision: 18, scale: 4 }),
  totalQty: numeric('total_qty', { precision: 18, scale: 4 }),
  actualQty: numeric('actual_qty', { precision: 18, scale: 4 }),
  differenceQty: numeric('difference_qty', { precision: 18, scale: 4 }),

  // Conversion data
  literQty: numeric('liter_qty', { precision: 18, scale: 4 }),
  kgQty: numeric('kg_qty', { precision: 18, scale: 4 }),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
```

#### 5.5 inventory_transactions (NEW - Audit Trail)

```javascript
export const inventoryTransactions = appSchema.table('inventory_transactions', {
  transactionId: bigserial('transaction_id', { mode: 'bigint' }).primaryKey(),

  productId: integer('product_id')
    .notNull()
    .references(() => products.productId),

  transactionType: varchar('transaction_type', { length: 50 }).notNull(),
  // Values: 'Inward', 'Production Consumption', 'Production Output',
  //         'Dispatch', 'Adjustment', 'Return'

  quantity: numeric('quantity', { precision: 18, scale: 4 }).notNull(), // Can be negative

  referenceType: varchar('reference_type', { length: 50 }),
  // Values: 'Batch', 'Order', 'PO', 'Adjustment'

  referenceId: integer('reference_id'),

  notes: text('notes'),

  createdBy: integer('created_by')
    .notNull()
    .references(() => employees.employeeId),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
```

### Updated Tables

#### 5.6 orders (Add production fields)

```javascript
// Add these fields to existing orders table:
{
  // ... existing fields ...

  expectedDeliveryDate: date('expected_delivery_date'),
  // Set by production manager after batch completion

  productionBatchId: integer('production_batch_id')
    .references(() => productionBatches.batchId),
  // Quick reference to batch (optional, can query via batch_orders)
}
```

#### 5.7 inventory (Add reservation field)

```javascript
// Add this field to existing inventory table:
{
  // ... existing fields ...

  reservedQty: numeric('reserved_qty', { precision: 18, scale: 4 }).default('0'),
  // Quantity reserved for ongoing batches or orders

  // availableQty = totalQty - reservedQty
}
```

### Order Status Flow

```
Pending
  ↓ (Accountant accepts)
Accepted
  ↓ (PM checks inventory)
  ├─→ Ready for Dispatch (if stock available)
  └─→ In Production Planning (if batch scheduled)
        ↓ (Supervisor starts batch)
      In Production
        ↓ (Batch completed)
      Ready for Dispatch
        ↓ (Dispatch)
      Dispatched
        ↓ (Delivery confirmed)
      Delivered
```

### Batch Status Flow

```
Scheduled
  ↓ (Supervisor starts)
In Progress
  ↓ (Supervisor completes)
Completed
```

---

## 6. Product Development Form

### Overview

The Product Development Form is a specialized module for creating and managing finished goods with detailed cost analysis and BOM calculation.

### UI Components (Based on Screenshot)

**Top Section - Product Details:**

- **Category Dropdown**: Select product category (e.g., HYDE PRIDE)
- **Per % Field**: Percentage value (default: 0)
- **Density Field**: Product density (e.g., 1.55)
- **Hours Field**: Production time required
- **Search Product**: Auto-complete search for existing products
- **Add Button**: Add new product line

### Raw Materials Section

**Table Columns:**
| Field | Description | Data Type |
|-------|-------------|-----------|
| Product Id | Unique identifier for raw material | Integer |
| Product Name | Name of raw material (e.g., ALPHOX 200, AMMONIA, CMC) | String |
| Percent % | Percentage composition in formula | Decimal(5,2) |
| Sequence | Order of addition in production | Integer |
| Rate | Cost per unit of raw material | Decimal(14,2) |
| Amount | Total cost (Rate × Quantity) | Decimal(14,2) |
| Solid % | Solid content percentage | Decimal(5,2) |
| Solid | Actual solid content | Decimal(18,4) |
| Density | Material density | Decimal(12,6) |
| Wt/LTR | Weight per liter | Decimal(18,4) |
| SV | Specific value | Decimal(18,4) |
| Delete | Remove material from BOM | Action |

**Example Raw Materials:**

```
ALPHOX 200    - 0.2%  - Seq 4  - Rate 168,000 - Amount 33.6
AMMONIA       - 0.3%  - Seq 8  - Rate 29,000  - Amount 8.7
CMC           - 0.34% - Seq 7  - Rate 362,000 - Amount 123.08
DEFOAMER      - 0.1%  - Seq 6  - Rate 182,000 - Amount 18.2
DEG           - 0.1%  - Seq 12 - Rate 76,000  - Amount 7.6
```

### Finished Goods Section

**Table Columns:**
| Field | Description |
|-------|-------------|
| Parkg cost | Packaging cost per unit |
| Packing Cost | Total packaging cost |
| ProductName | Final product name (e.g., HYDE PRIDE 1 LTR, HYDE PRIDE 10 LTR) |
| packQty | Quantity per package |
| Unit selling rate | Selling price per unit |
| Per ltr cost | Cost per liter |
| Production cost | Total production cost |
| Gross Profit | Profit margin |

**Example Products:**

```
HYDE PRIDE 1 LTR     - Pkg: 14.7 - Pack: 17,800  - Qty: 1  - Sell: 79.00  - Cost/L: 32.5  - Prod: 32.5  - Profit: 58.66
HYDE PRIDE 10 LTR    - Pkg: 14.7 - Pack: 88,500  - Qty: 10 - Sell: 499.00 - Cost/L: 23.55 - Prod: 235.5 - Profit: 52.81
HYDE PRIDE 20 LTR    - Pkg: 14.7 - Pack: 156,000 - Qty: 20 - Sell: 763.00 - Cost/L: 22.6  - Prod: 452   - Profit: 40.76
HYDE PRIDE 20 LTR Bag- Pkg: 14.7 - Pack: 14,600  - Qty: 20 - Sell: 705.00 - Cost/L: 15.43 - Prod: 308.6 - Profit: 56.23
HYDE PRIDE 4 LTR     - Pkg: 14.7 - Pack: 44,500  - Qty: 4  - Sell: 249.00 - Cost/L: 25.82 - Prod: 103.3 - Profit: 58.51
```

### Database Schema for Product Development

```javascript
export const productDevelopment = appSchema.table('product_development', {
  developmentId: serial('development_id').primaryKey(),
  developmentUuid: uuid('development_uuid').defaultRandom().notNull(),

  // Product Info
  categoryId: integer('category_id').references(() => categories.categoryId),
  productName: varchar('product_name', { length: 200 }).notNull(),

  // Formula Details
  density: numeric('density', { precision: 12, scale: 6 }),
  percentageValue: numeric('percentage_value', { precision: 5, scale: 2 }),
  productionHours: numeric('production_hours', { precision: 8, scale: 2 }),

  // Status
  status: varchar('status', { length: 20 }).default('Draft'),
  // Values: Draft, Approved, In Production, Archived

  // Approval
  approvedBy: integer('approved_by').references(() => employees.employeeId),
  approvedAt: timestamp('approved_at', { withTimezone: true }),

  // Audit
  createdBy: integer('created_by')
    .notNull()
    .references(() => employees.employeeId),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const productDevelopmentMaterials = appSchema.table('product_development_materials', {
  devMaterialId: serial('dev_material_id').primaryKey(),

  developmentId: integer('development_id')
    .notNull()
    .references(() => productDevelopment.developmentId, { onDelete: 'cascade' }),

  materialId: integer('material_id')
    .notNull()
    .references(() => products.productId),

  // Composition
  percentage: numeric('percentage', { precision: 5, scale: 2 }).notNull(),
  sequence: integer('sequence').notNull(),

  // Costing
  rate: numeric('rate', { precision: 14, scale: 2 }),
  amount: numeric('amount', { precision: 14, scale: 2 }),

  // Technical Details
  solidPercentage: numeric('solid_percentage', { precision: 5, scale: 2 }),
  solidContent: numeric('solid_content', { precision: 18, scale: 4 }),
  density: numeric('density', { precision: 12, scale: 6 }),
  weightPerLiter: numeric('weight_per_liter', { precision: 18, scale: 4 }),
  specificValue: numeric('specific_value', { precision: 18, scale: 4 }),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const productDevelopmentFinishedGoods = appSchema.table(
  'product_development_finished_goods',
  {
    devFgId: serial('dev_fg_id').primaryKey(),

    developmentId: integer('development_id')
      .notNull()
      .references(() => productDevelopment.developmentId, { onDelete: 'cascade' }),

    productId: integer('product_id').references(() => products.productId),
    productName: varchar('product_name', { length: 200 }).notNull(),

    // Packaging
    packagingCost: numeric('packaging_cost', { precision: 14, scale: 2 }),
    packingCostTotal: numeric('packing_cost_total', { precision: 14, scale: 2 }),
    packageQuantity: numeric('package_quantity', { precision: 18, scale: 4 }),

    // Pricing
    unitSellingRate: numeric('unit_selling_rate', { precision: 14, scale: 2 }),
    costPerLiter: numeric('cost_per_liter', { precision: 14, scale: 2 }),
    productionCost: numeric('production_cost', { precision: 14, scale: 2 }),
    grossProfit: numeric('gross_profit', { precision: 14, scale: 2 }),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  }
);
```

### Key Features

1. **BOM Formula Builder**: Create product formulas with percentage-based raw material composition
2. **Auto Cost Calculation**: Automatically calculate material costs based on rates and percentages
3. **Multiple Package Sizes**: Define different package sizes (1L, 4L, 10L, 20L, Bag) for same base product
4. **Profit Analysis**: Real-time gross profit calculation for each SKU
5. **Sequence Management**: Control the order of material addition in production
6. **Technical Parameters**: Track density, solid content, and other chemical properties

### Business Logic

```javascript
// Calculate material amount based on percentage and rate
function calculateMaterialAmount(percentage, rate, totalQuantity) {
  return (percentage / 100) * rate * totalQuantity;
}

// Calculate gross profit
function calculateGrossProfit(sellingPrice, productionCost, packagingCost) {
  const totalCost = productionCost + packagingCost;
  const profit = sellingPrice - totalCost;
  const profitPercentage = (profit / sellingPrice) * 100;
  return profitPercentage;
}

// Calculate cost per liter
function calculateCostPerLiter(totalMaterialCost, totalQuantityLiters) {
  return totalMaterialCost / totalQuantityLiters;
}
```

---

## 7. BOM Production Module

### Overview

The BOM Production module allows production managers to create production batches based on approved product formulas with real-time inventory checks.

### UI Components (Based on Screenshot)

**Header Section:**

- **Select Supervisor**: Dropdown to assign supervisor (e.g., Mr. Saling Bhalerao)
- **Enter Labour**: Text field for labour names (e.g., "dIkjshgf")
- **Category**: Dropdown for product category (e.g., PU AGATE GREY 7038 GLOSSY)
- **Qty**: Quantity to produce (e.g., 63)
- **Calculate Button**: Trigger BOM calculation

**Material Selection:**

- **Product Dropdown**: Select additional products if needed
- **Qty Fields**: Specify quantities
- **Add Button**: Add to production list

### Raw Materials Availability Table

**Columns:**
| Field | Description | Display |
|-------|-------------|---------|
| Product Id | Material ID | Integer |
| Product Name | Material name | String |
| Unit | Measurement unit | String (Kg, L) |
| Available | Current stock | Decimal with high precision |
| Percent % | Required percentage from BOM | Decimal(5,2) |
| Value | Calculated required quantity | Decimal(18,4) |

**Example Display:**

```
┌────────────┬─────────────────────┬──────┬────────────────────┬───────────┬─────────┐
│ Product Id │ Product Name        │ Unit │ Available          │ Percent % │ Value   │
├────────────┼─────────────────────┼──────┼────────────────────┼───────────┼─────────┤
│ 28         │ 8080                │ Kg   │ 3341.87700000007   │ 1.237     │ 0.779   │
│            │ Carbon Black        │ Kg   │ 47.009999999994    │ 0.005     │ 0.003   │
│ 224        │ CELLOCOLVE ACETATE  │ Kg   │ 81.3               │ 3.71      │ 2.337   │
│ 891        │ DM100               │ Kg   │ 45.420000000001    │ 0.247     │ 0.156   │
│ 268        │ ...                 │ Kg   │ ...                │ ...       │ ...     │
└────────────┴─────────────────────┴──────┴────────────────────┴───────────┴─────────┘
```

### Key Features

1. **Real-Time Inventory Check**: Shows current available stock vs. required quantity
2. **Automatic BOM Calculation**: Calculate material requirements based on quantity and BOM percentages
3. **Color-Coded Availability**: Highlight materials with insufficient stock
4. **Supervisor Assignment**: Link batch to specific supervisor
5. **Labour Tracking**: Record labour/workers for the batch
6. **Multi-Product Batching**: Optionally add multiple products to same batch

### Database Schema Enhancement

```javascript
// Add to existing production_batches table
export const productionBatchesEnhanced = {
  // ... existing fields ...

  // Labour tracking
  labourNames: text('labour_names'),
  labourCount: integer('labour_count'),

  // Links to product development
  developmentId: integer('development_id').references(() => productDevelopment.developmentId),

  // Calculation metadata
  calculatedAt: timestamp('calculated_at', { withTimezone: true }),
  bomVersion: integer('bom_version'), // Track BOM version used
};
```

### Backend Logic

```javascript
async function calculateBOMRequirements(productId, quantity) {
  // 1. Get approved product development/BOM
  const bom = await db
    .select()
    .from(productDevelopmentMaterials)
    .innerJoin(
      productDevelopment,
      eq(productDevelopmentMaterials.developmentId, productDevelopment.developmentId)
    )
    .where(
      and(eq(productDevelopment.productId, productId), eq(productDevelopment.status, 'Approved'))
    )
    .orderBy(productDevelopmentMaterials.sequence);

  // 2. Calculate required quantities
  const requirements = [];
  for (const material of bom) {
    const requiredQty = (quantity * material.percentage) / 100;

    // 3. Check inventory
    const inventory = await db
      .select({ available: inventory.availableQty })
      .from(inventory)
      .where(eq(inventory.productId, material.materialId))
      .limit(1);

    requirements.push({
      materialId: material.materialId,
      materialName: material.materialName,
      unit: material.unit,
      percentage: material.percentage,
      requiredQty,
      availableQty: inventory[0]?.available || 0,
      sufficient: (inventory[0]?.available || 0) >= requiredQty,
      shortfall: Math.max(0, requiredQty - (inventory[0]?.available || 0)),
    });
  }

  return {
    product: productId,
    quantity,
    requirements,
    allMaterialsAvailable: requirements.every(r => r.sufficient),
  };
}
```

### Material Shortage Handling

```javascript
async function handleMaterialShortage(batchId) {
  const shortages = await getShortages(batchId);

  if (shortages.length > 0) {
    // Create procurement requests
    for (const shortage of shortages) {
      await db.insert(procurementRequests).values({
        materialId: shortage.materialId,
        requiredQuantity: shortage.shortfall,
        urgency: 'High',
        requestedFor: 'Production',
        referenceType: 'Batch',
        referenceId: batchId,
        status: 'Pending',
        createdBy: currentUser.employeeId,
      });
    }

    // Notify procurement team
    await sendNotification({
      type: 'MaterialShortage',
      recipients: ['procurement', 'admin'],
      message: `Material shortage detected for Batch ${batchId}`,
      data: shortages,
    });

    // Update batch status
    await db
      .update(productionBatches)
      .set({ status: 'On Hold - Material Shortage' })
      .where(eq(productionBatches.batchId, batchId));
  }
}
```

---

## 8. Batch Management Dashboard

### Overview

The Batch Management Dashboard provides a comprehensive view of all production batches with real-time status tracking and action buttons.

### UI Components (Based on Screenshot)

**Action Buttons:**

- **Start Batch**: Begin production for scheduled batch
- **End Batch**: Mark batch as completed (opens completion form)

### Batch Table Columns

| Field            | Description                | Display Format                   |
| ---------------- | -------------------------- | -------------------------------- |
| Batchid          | Batch identifier           | B237-12-2025 format              |
| Superviser       | Assigned supervisor        | Name (e.g., Mr. Saling Bhalerao) |
| Product          | Product being manufactured | Product name                     |
| Labour           | Workers assigned           | Names (e.g., GANESH AND ROHIDAS) |
| Time Required    | Estimated production time  | Integer (hours)                  |
| STD              | Standard time              | Integer                          |
| Product Qty      | Planned quantity           | Decimal                          |
| Production Qty   | Actual produced            | Decimal (editable)               |
| Standard Density | Expected density           | Decimal                          |
| Actual Density   | Measured density           | Decimal (editable)               |
| Diff             | Density difference         | Auto-calculated                  |
| Cancel Batch     | Cancel/abort batch         | Action button (❌)               |
| Download Report  | Export batch report        | Action button (📥)               |
| Select           | Select for bulk actions    | Checkbox/button (✓)              |

**Example Batch Rows:**

```
┌───────────────┬──────────────────┬─────────────────┬──────────────────┬──────────┬─────┬─────────┬──────────────┬─────────┬────────┬──────┬────────┬──────────┬────────┐
│ B237-12-2025  │ Mr. S. Bhalerao  │ PU HARDNER      │ GANESH & ROHIDAS │ 0        │ 0   │ 4.75    │ 0            │ 0       │ 0      │ 0    │ ❌     │ 📥       │ ✓      │
│               │                  │ PUTC1           │                  │          │     │         │              │         │        │      │        │          │        │
├───────────────┼──────────────────┼─────────────────┼──────────────────┼──────────┼─────┼─────────┼──────────────┼─────────┼────────┼──────┼────────┼──────────┼────────┤
│ B236-12-2025  │ Mr. S. Bhalerao  │ PU AGATE        │ GANESH & ROHIDAS │ 0        │ 0   │ 21      │ 0            │ 1       │ 0      │ 0    │ ❌     │ 📥       │ ✓      │
│               │                  │ GREY 7038       │                  │          │     │         │              │         │        │      │        │          │        │
│               │                  │ GLOSSY          │                  │          │     │         │              │         │        │      │        │          │        │
├───────────────┼──────────────────┼─────────────────┼──────────────────┼──────────┼─────┼─────────┼──────────────┼─────────┼────────┼──────┼────────┼──────────┼────────┤
│ B235-12-2025  │ Mr. S. Bhalerao  │ BLACK SE        │ GANESH & ROHIDAS │ 3        │ 3   │ 125     │ 0            │ 0       │ 0      │ 0    │ ❌     │ 📥       │ ✓      │
│               │                  │ REGULAR         │                  │          │     │         │              │         │        │      │        │          │        │
├───────────────┼──────────────────┼─────────────────┼──────────────────┼──────────┼─────┼─────────┼──────────────┼─────────┼────────┼──────┼────────┼──────────┼────────┤
│ B234-12-2025  │ Mr. S. Bhalerao  │ OX BLUE SE      │ GANESH & ROHIDAS │ 2        │ 2   │ 10      │ 0            │ 0       │ 0      │ 0    │ ❌     │ 📥       │ ✓      │
│               │                  │ 2ND             │                  │          │     │         │              │         │        │      │        │          │        │
└───────────────┴──────────────────┴─────────────────┴──────────────────┴──────────┴─────┴─────────┴──────────────┴─────────┴────────┴──────┴────────┴──────────┴────────┘
```

### Status Indicators

**Visual Indicators:**

- **Scheduled** - Blue background, all values at 0
- **In Progress** - Yellow/Tan background, production values being entered
- **Completed** - Green background, all values filled
- **On Hold** - Orange, with alert icon
- **Cancelled** - Red with ❌ icon

### Key Features

1. **Real-Time Status Updates**: Auto-refresh batch status
2. **In-Line Editing**: Update production qty and density directly in table
3. **Bulk Actions**: Select multiple batches for bulk operations
4. **Quick Reports**: Download batch report instantly
5. **Time Tracking**: Shows required vs. actual time
6. **Density Variance**: Auto-calculate density difference
7. **Supervisor View**: Filter by assigned supervisor
8. **Labour Assignment**: Track which workers are on which batch

### Enhanced Database Schema

```javascript
// Add these fields to production_batches
export const productionBatchesComplete = {
  // ... existing fields ...

  // Time tracking
  timeRequired: integer('time_required'), // hours
  standardTime: integer('standard_time'), // STD hours
  actualTimeStarted: timestamp('actual_time_started', { withTimezone: true }),
  actualTimeEnded: timestamp('actual_time_ended', { withTimezone: true }),

  // Density tracking
  standardDensity: numeric('standard_density', { precision: 12, scale: 6 }),
  actualDensity: numeric('actual_density', { precision: 12, scale: 6 }),
  densityDifference: numeric('density_difference', { precision: 12, scale: 6 }).generatedAlwaysAs(
    `actual_density - standard_density`
  ),

  // Quality metrics
  qualityStatus: varchar('quality_status', { length: 20 }),
  // Values: Pending, Passed, Failed, Rework Required

  qualityCheckBy: integer('quality_check_by').references(() => employees.employeeId),
  qualityCheckAt: timestamp('quality_check_at', { withTimezone: true }),
  qualityRemarks: text('quality_remarks'),
};
```

### Batch Actions API

```javascript
// Start Batch
async function startBatch(batchId, startData) {
  await db
    .update(productionBatches)
    .set({
      status: 'In Progress',
      actualTimeStarted: new Date(),
      supervisorId: startData.supervisorId,
      labourNames: startData.labourNames,
      updatedAt: new Date(),
    })
    .where(eq(productionBatches.batchId, batchId));

  // Reserve materials
  await reserveBatchMaterials(batchId);

  return { success: true, message: 'Batch started successfully' };
}

// End Batch (Completion)
async function endBatch(batchId, completionData) {
  const tx = await db.transaction(async trx => {
    // 1. Update batch with actual data
    await trx
      .update(productionBatches)
      .set({
        status: 'Completed',
        actualQuantity: completionData.productionQty,
        actualDensity: completionData.actualDensity,
        actualTimeEnded: new Date(),
        completedBy: currentUser.employeeId,
        updatedAt: new Date(),
      })
      .where(eq(productionBatches.batchId, batchId));

    // 2. Update inventory
    await updateInventoryAfterProduction(batchId, completionData);

    // 3. Update order statuses
    await updateLinkedOrderStatuses(batchId);

    // 4. Log completion
    await trx.insert(batchActivityLog).values({
      batchId,
      activityType: 'Completed',
      performedBy: currentUser.employeeId,
      remarks: completionData.remarks,
      createdAt: new Date(),
    });

    return { success: true };
  });

  return tx;
}

// Cancel Batch
async function cancelBatch(batchId, reason) {
  const tx = await db.transaction(async trx => {
    // 1. Update batch status
    await trx
      .update(productionBatches)
      .set({
        status: 'Cancelled',
        cancelledBy: currentUser.employeeId,
        cancelReason: reason,
        cancelledAt: new Date(),
      })
      .where(eq(productionBatches.batchId, batchId));

    // 2. Release reserved materials
    await releaseReservedMaterials(batchId);

    // 3. Update order statuses back to Accepted
    await trx
      .update(orders)
      .set({ status: 'Accepted' })
      .where(
        inArray(
          orders.orderId,
          select({ orderId: batchOrders.orderId })
            .from(batchOrders)
            .where(eq(batchOrders.batchId, batchId))
        )
      );

    return { success: true };
  });

  return tx;
}

// Download Batch Report
async function downloadBatchReport(batchId) {
  const batch = await getBatchFullDetails(batchId);
  const materials = await getBatchMaterials(batchId);
  const orders = await getBatchOrders(batchId);

  // Generate PDF using jsPDF or similar
  const pdf = await generateBatchPDF({
    batch,
    materials,
    orders,
    format: 'detailed', // or 'summary'
  });

  return {
    filename: `Batch_${batch.batchNo}_Report.pdf`,
    content: pdf,
    mimeType: 'application/pdf',
  };
}
```

### Additional Tables for Batch Management

```javascript
// Batch Activity Log
export const batchActivityLog = appSchema.table('batch_activity_log', {
  logId: bigserial('log_id', { mode: 'bigint' }).primaryKey(),

  batchId: integer('batch_id')
    .notNull()
    .references(() => productionBatches.batchId, { onDelete: 'cascade' }),

  activityType: varchar('activity_type', { length: 50 }).notNull(),
  // Values: Created, Started, Paused, Resumed, Completed, Cancelled, Quality Check

  performedBy: integer('performed_by')
    .notNull()
    .references(() => employees.employeeId),

  remarks: text('remarks'),
  metadata: text('metadata'), // JSON for additional data

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Quality Check Records
export const batchQualityChecks = appSchema.table('batch_quality_checks', {
  qualityCheckId: serial('quality_check_id').primaryKey(),

  batchId: integer('batch_id')
    .notNull()
    .references(() => productionBatches.batchId, { onDelete: 'cascade' }),

  checkType: varchar('check_type', { length: 50 }).notNull(),
  // Values: Density, Viscosity, Color, Consistency, pH, etc.

  expectedValue: varchar('expected_value', { length: 100 }),
  actualValue: varchar('actual_value', { length: 100 }),
  status: varchar('status', { length: 20 }).notNull(),
  // Values: Pass, Fail, Rework

  checkedBy: integer('checked_by')
    .notNull()
    .references(() => employees.employeeId),

  remarks: text('remarks'),
  checkedAt: timestamp('checked_at', { withTimezone: true }).defaultNow(),
});
```

---

## 9. API Endpoints Design

### 6.1 Accountant APIs

```javascript
// POST /api/accounts/accept-order
{
  orderId: number,
  billNo: string,
  billDate: string,
  billAmount: number,
  paymentStatus: 'Pending' | 'Partial' | 'Cleared' | 'Overdue',
  paymentMethod: string,
  paymentReference: string,
  paymentDate: string,
  remarks: string
}

// PUT /api/accounts/:orderId/hold
{
  reason: string
}

// GET /api/accounts/pending-orders
// Returns orders with status 'Pending'
```

### 6.2 Production Manager APIs

```javascript
// GET /api/production/pending-orders
// Returns orders with status 'Accepted'

// POST /api/production/check-inventory
{
  orderId: number
}
// Returns availability status for each product

// POST /api/production/dispatch-immediate
{
  orderId: number,
  reserveInventory: boolean
}

// POST /api/production/create-batch
{
  orderIds: number[],
  masterProductId: number,
  scheduledDate: string,
  plannedQuantity: number,
  density: number,
  waterPercentage: number
}

// GET /api/production/batches
// Query params: status, date, product

// GET /api/production/batch/:batchId/details

// GET /api/production/batch/:batchId/materials-availability

// GET /api/production/batch/:batchId/export-chart
// Returns PDF/Excel
```

### 6.3 Production Supervisor APIs

```javascript
// GET /api/production/my-batches
// Batches assigned to current supervisor

// POST /api/production/batch/:batchId/start
{
  supervisorId: number
}

// POST /api/production/batch/:batchId/complete
{
  actualQuantity: number,
  actualDensity: number,
  actualWaterPercentage: number,
  actualViscosity: string,
  startDateTime: string,
  endDateTime: string,
  labourNames: string,
  actualMaterials: [{
    materialId: number,
    actualQuantity: number
  }],
  remarks: string
}

// PUT /api/production/batch/:batchId/cancel
{
  reason: string
}
```

### 6.4 Dispatch APIs

```javascript
// GET /api/dispatch/ready-orders
// Orders with status 'Ready for Dispatch'

// POST /api/dispatch/dispatch-order
{
  orderId: number,
  vehicleNo: string,
  driverName: string,
  challanNo: string,
  dispatchDate: string
}

// POST /api/dispatch/confirm-delivery
{
  orderId: number,
  deliveryDate: string,
  receivedBy: string,
  signature: string (base64)
}
```

---

## 7. UI/UX Specifications

### 7.1 Accountant Dashboard

**Route:** `/accountant/orders`

**Components:**

- OrdersDataTable with status filter
- AcceptOrderModal
- PaymentDetailsForm

**Key Features:**

- Quick filters: Pending, Accepted, On Hold
- Search by customer, order number
- Sort by date, amount, priority
- Bulk actions: Export to Excel

### 7.2 Production Manager Dashboard

**Route:** `/production/dashboard`

**Tabs:**

1. **Pending Assessment** - Orders needing inventory check
2. **Batch Scheduler** - Create and manage batches
3. **Active Batches** - Monitor ongoing production
4. **Ready for Dispatch** - Orders awaiting dispatch

**Components:**

- InventoryCheckModal
- BatchSchedulerWizard
- BatchCalendar
- MaterialAvailabilityChart

### 7.3 Production Supervisor Dashboard

**Route:** `/production/batches`

**Views:**

- Card view (default)
- List view
- Calendar view

**Components:**

- BatchCard
- BatchDetailsModal
- StartBatchModal
- CompleteBatchForm
- ExportBatchChartButton

### 7.4 Batch Chart Print Layout

**Based on attached images, create print-ready layout:**

**Page 1: Batch Overview**

- Company header (DMOR PAINTS)
- Batch number, date, supervisor
- Product details
- Production quantities
- Density, water %, viscosity

**Table 1: Raw Materials**
| Product | UsePer | UseQty | Check |

- Show all raw materials from BOM
- Calculate based on density and percentage
- Checkbox for supervisor to mark availability

**Table 2: Sub-Products**
| Product | QTY | LTR | KG |

- List all product variants in the batch
- Show quantities in different units

**Page 2: Production Tracking**
| Product | APP QTY | BATCH QTY | DISPATCH QTY | TOTAL | ACTUAL QTY | DIFFERENCE |

- Track production against orders
- Fields for manual entry during production
- Auto-calculate differences

**Footer:**

- Labours field
- Start/End time fields
- Production remarks section

---

## 8. Implementation Phases

### Phase 1: Database Schema (Week 1)

- ✅ Create new tables
- ✅ Add migrations
- ✅ Update seed data
- ✅ Test relationships

### Phase 2: Backend APIs (Week 2-3)

**Sprint 1: Accountant Module**

- Accounts acceptance API
- Order status updates
- Payment tracking

**Sprint 2: Production Manager Module**

- Inventory check logic
- Batch creation API
- Order-to-batch linking
- BOM calculation for batches

**Sprint 3: Production Supervisor Module**

- Start batch validation
- Material reservation
- Complete batch logic
- Inventory updates

### Phase 3: Frontend UI (Week 4-5)

**Sprint 1: Accountant UI**

- Orders dashboard
- Accept order modal
- Payment forms

**Sprint 2: Production Manager UI**

- Production dashboard
- Inventory checker
- Batch scheduler wizard
- Batch calendar

**Sprint 3: Production Supervisor UI**

- Batch list/card view
- Start batch interface
- Complete batch form
- Print batch chart

### Phase 4: Reports & Analytics (Week 6)

- Production efficiency reports
- Material consumption analytics
- Batch performance metrics
- Order fulfillment tracking

### Phase 5: Testing & Refinement (Week 7)

- End-to-end workflow testing
- Performance optimization
- Bug fixes
- User acceptance testing

### Phase 6: Deployment (Week 8)

- Production deployment
- Data migration
- User training
- Documentation

---

## 9. Technical Specifications

### 9.1 Technology Stack

**Backend:**

- Node.js + Express
- Drizzle ORM
- PostgreSQL
- Zod (validation)

**Frontend:**

- React + TypeScript
- TanStack Table
- React Hook Form
- Date-fns

**Reports:**

- jsPDF (PDF generation)
- xlsx (Excel export)

### 9.2 Performance Considerations

**Database Indexes:**

```sql
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_batches_status ON production_batches(status);
CREATE INDEX idx_batches_scheduled_date ON production_batches(scheduled_date);
CREATE INDEX idx_batch_orders_batch ON batch_orders(batch_id);
CREATE INDEX idx_batch_orders_order ON batch_orders(order_id);
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_transactions_product ON inventory_transactions(product_id);
CREATE INDEX idx_inventory_transactions_date ON inventory_transactions(created_at);
```

**Caching Strategy:**

- Cache BOM calculations (Redis)
- Cache inventory counts (5-minute TTL)
- Cache product lists for dropdowns

**Transaction Management:**

- Use database transactions for:
  - Batch creation (multiple inserts)
  - Batch completion (inventory updates)
  - Order acceptance (order + account update)

### 9.3 Security Considerations

**Role-Based Access:**

- Implement middleware to check user role
- Restrict APIs by department
- Log all sensitive actions

**Data Validation:**

- Validate all inputs with Zod schemas
- Prevent negative inventory
- Validate date ranges
- Check material availability before starting batch

### 9.4 Error Handling

**Graceful Degradation:**

- Handle insufficient inventory
- Handle missing BOM data
- Handle concurrent batch creation
- Transaction rollback on errors

**User Feedback:**

- Clear error messages
- Loading states
- Success confirmations
- Warning dialogs for critical actions

---

## 10. Complex Scenarios & Edge Cases

### Scenario 1: Partial Inventory Dispatch

**Problem:** Order has 3 products, only 2 available in stock

**Solution:**

- Allow partial dispatch
- Create batch only for unavailable items
- Update order status to "Partially Dispatched"
- Show pending items clearly

### Scenario 2: Batch Cancellation

**Problem:** Batch needs to be cancelled mid-production

**Solution:**

- Release reserved materials
- Revert order statuses
- Log cancellation reason
- Notify affected parties

### Scenario 3: Material Shortage During Production

**Problem:** Material runs out after batch start

**Solution:**

- Allow batch pause
- Reserve mechanism prevents this
- Emergency procurement trigger
- Reschedule batch if needed

### Scenario 4: Over-Production

**Problem:** Actual quantity > planned quantity

**Solution:**

- Accept over-production
- Add excess to inventory
- Flag for review
- Analyze material consumption

### Scenario 5: Multi-Product Batch

**Problem:** Can we batch different products?

**Solution:**

- Current design: One master product per batch
- Future: Allow multi-product batches
- Would need additional batch grouping logic

### Scenario 6: Rush Orders

**Problem:** High priority order needs immediate production

**Solution:**

- Allow batch creation for single order
- Priority scheduling
- Express batch flag
- Notify production team

---

## Conclusion

This comprehensive design provides a production-ready foundation for managing the complete order-to-dispatch workflow with integrated production planning and batch management. The system ensures:

✅ Clear role separation and accountability
✅ Full inventory tracking and audit trail
✅ Flexible batch scheduling and consolidation
✅ Accurate material consumption tracking
✅ Seamless integration with existing systems
✅ Scalable architecture for future enhancements

**Next Steps:**

1. Review and approve this design
2. Begin Phase 1 implementation
3. Set up project tracking board
4. Allocate development resources
5. Schedule regular progress reviews

---

**Document Version:** 1.0
**Date:** December 10, 2025
**Prepared By:** AI Development Team
**Status:** Ready for Review

┌─────────────────┐
│ Create Order │
└────────┬────────┘
▼
┌─────────────────┐
│ Admin Accepts │ → Status: "Accepted"
└────────┬────────┘
▼
┌─────────────────┐
│ PM Accepted │ ← Shows in AcceptedOrdersDataTable
│ Orders Page │
└────────┬────────┘
│
┌────┴────┐
▼ ▼
┌───────┐ ┌──────────┐
│ Stock │ │ No Stock │
│ OK │ │ (Produce)│
└───┬───┘ └────┬─────┘
│ ▼
│ ┌──────────┐
│ │ Schedule │
│ │ Batch │
│ └────┬─────┘
│ ▼
│ ┌──────────┐
│ │ Complete │ → Adds to Inventory
│ │ Batch │
│ └────┬─────┘
└─────┬───┘
▼
┌─────────────────────┐
│ Send to Dispatch │ → Reserves Inventory
│ (PM or via Orders │ Status: "Ready for Dispatch"
│ View in Dispatch) │
└─────────┬───────────┘
▼
┌─────────────────────┐
│ Dispatch Planning │ ← Orders appear in Dispatch Queue
│ Page │ AND Orders View
└─────────┬───────────┘
▼
┌─────────────────────┐
│ Create Dispatch │ → Deducts Inventory
│ │ Status: "Dispatched"
└─────────────────────┘
