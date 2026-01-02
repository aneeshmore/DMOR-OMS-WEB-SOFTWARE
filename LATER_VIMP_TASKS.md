# LATER VIMP TASKS - Security & Middleware Implementation and API-contract UPDATION after all merge, UI UNIFICATION, API OPTIMIZATION, LESS backend based calcualtions optimization

## 🔴 CRITICAL SECURITY ISSUES (HIGH PRIORITY)

### 1. Authentication Middleware Missing ⚠️

**Status:** NOT IMPLEMENTED
**Priority:** CRITICAL
**Impact:** All API endpoints are publicly accessible without authentication

**What's Missing:**

- JWT token verification middleware
- Token validation and parsing
- User session management
- Token expiry handling
- Refresh token mechanism

**Required Implementation:**

```javascript
// Create: server/src/middleware/auth.js
- authenticate middleware (verify JWT tokens)
- extractUser middleware (parse user from token)
- requireAuth middleware (protect routes)
```

**Affected Routes:**

- ❌ `/api/v1/orders/*` - Anyone can view/create/delete orders
- ❌ `/api/v1/inventory/*` - Public inventory access
- ❌ `/api/v1/employees/*` - Employee data exposed
- ❌ `/api/v1/production-batches/*` - Production data accessible
- ❌ `/api/v1/bom/*` - BOM data public
- ❌ `/api/v1/masters/*` - Master data unprotected
- ❌ `/api/v1/dashboard/*` - Dashboard analytics public
- ❌ `/api/v1/catalog/*` - Product catalog unprotected

---

### 2. Authorization Middleware Missing ⚠️

**Status:** NOT IMPLEMENTED
**Priority:** CRITICAL
**Impact:** No role-based access control despite having comprehensive permission system

**What's Missing:**

- Role-based access control (RBAC)
- Permission checking middleware
- Resource-level authorization
- Action-based permissions (create, modify, view, lock)

**Required Implementation:**

```javascript
// Create: server/src/middleware/permissions.js
- requirePermission(permissionName) middleware
- requireRole(roleName) middleware
- checkPermission(permission, action) middleware
- canCreate, canModify, canView, canLock checks
```

**Database Schema Already Exists:**

- ✅ `role_permissions` table with canCreate, canModify, canView, canLock flags
- ✅ 26 permissions created (manage_users, manage_orders, etc.)
- ✅ 4 roles created (SuperAdmin, Admin, Manager, Sales)
- ✅ Permission assignments already seeded

**Example Usage Needed:**

```javascript
// Protect routes with specific permissions
router.post('/orders', requirePermission('manage_orders', 'create'), controller.createOrder);
router.put('/orders/:id', requirePermission('manage_orders', 'modify'), controller.updateOrder);
router.get('/orders', requirePermission('view_orders'), controller.getAllOrders);
```

---

### 3. Rate Limiters Not Applied ⚠️

**Status:** PARTIALLY IMPLEMENTED
**Priority:** HIGH
**Impact:** Write operations and create endpoints not protected from abuse

**What's Working:**

- ✅ `apiLimiter` - Applied to all API routes (100 req/15min)
- ✅ `authLimiter` - Applied to login endpoint (5 req/15min)
- ✅ `requestLogger` - Applied globally
- ✅ `errorHandler` - Applied globally

**What's NOT Being Used:**

- ❌ `strictLimiter` - Created but not applied to POST/PUT/DELETE routes
- ❌ `createLimiter` - Created but not applied to POST endpoints

**Required Implementation:**
Apply rate limiters to specific routes:

```javascript
// In routes files
import { strictLimiter, createLimiter } from '../../middleware/rateLimiter.js';

// Apply to write operations
router.post('/orders', strictLimiter, controller.createOrder);
router.put('/orders/:id', strictLimiter, controller.updateOrder);
router.delete('/orders/:id', strictLimiter, controller.deleteOrder);

// Apply to high-value create endpoints
router.post('/employees', createLimiter, controller.createEmployee);
router.post('/products', createLimiter, controller.createProduct);
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Authentication (Week 1)

- [ ] Create `server/src/middleware/auth.js`
  - [ ] `authenticate` - Verify JWT tokens from Authorization header
  - [ ] `extractUser` - Parse user details from valid token
  - [ ] `requireAuth` - Combine authenticate + extractUser
  - [ ] Handle token expiry and invalid tokens
  - [ ] Add req.user to request object

- [ ] Update `server/src/modules/authority/controller.js`
  - [ ] Ensure JWT generation on login
  - [ ] Add token expiry (e.g., 24 hours)
  - [ ] Implement refresh token logic (optional)

- [ ] Apply `requireAuth` to all protected routes
  - [ ] Update `server/src/routes/index.js`
  - [ ] Exempt only `/auth/login` and `/health` endpoints

### Phase 2: Authorization (Week 2)

- [ ] Create `server/src/middleware/permissions.js`
  - [ ] `requirePermission(permissionName, action?)` middleware
  - [ ] `requireRole(roleName)` middleware
  - [ ] `checkUserPermissions(userId)` helper
  - [ ] Cache user permissions in memory/Redis for performance

- [ ] Create permission checking utilities
  - [ ] `hasPermission(user, permission, action)` function
  - [ ] `getUserRoles(userId)` function
  - [ ] `getUserPermissions(userId)` function

- [ ] Apply permission middleware to routes
  - [ ] Orders: `manage_orders`, `view_orders`
  - [ ] Inventory: `manage_inventory`, `view_inventory`
  - [ ] Employees: `manage_users`, `view_users`
  - [ ] Production: `manage_production`, `view_production`
  - [ ] BOM: `manage_bom`
  - [ ] Customers: `manage_customers`, `view_customers`
  - [ ] Products: `manage_products`, `view_products`
  - [ ] Reports: `view_reports`, `export_data`
  - [ ] System: `system_settings`, `manage_roles`

### Phase 3: Rate Limiting Enhancement (Week 2)

- [ ] Apply `strictLimiter` to all write operations
  - [ ] All POST routes (except login)
  - [ ] All PUT routes
  - [ ] All DELETE routes

- [ ] Apply `createLimiter` to sensitive create endpoints
  - [ ] Employee creation
  - [ ] Product creation
  - [ ] Customer creation
  - [ ] Order creation

- [ ] Create custom limiters for specific use cases
  - [ ] Order placement limiter (prevent spam orders)
  - [ ] Export data limiter (prevent data scraping)

### Phase 4: Testing & Validation (Week 3)

- [ ] Test authentication flows
  - [ ] Valid token access
  - [ ] Expired token rejection
  - [ ] Invalid token rejection
  - [ ] Missing token rejection

- [ ] Test authorization flows
  - [ ] SuperAdmin has full access
  - [ ] Admin has appropriate access
  - [ ] Manager has limited access
  - [ ] Sales has restricted access
  - [ ] Unauthorized action attempts blocked

- [ ] Test rate limiting
  - [ ] Verify limits are enforced
  - [ ] Test different IP addresses
  - [ ] Verify error messages

- [ ] Security testing
  - [ ] Test JWT manipulation attempts
  - [ ] Test permission escalation attempts
  - [ ] Test concurrent request handling

---

## 🔧 QUICK REFERENCE: Current Permissions in Database

### All 26 Permissions Created:

1. `manage_users` - Create, update, delete users
2. `view_users` - View users
3. `manage_roles` - Create, update, delete roles
4. `manage_permissions` - Assign permissions to roles
5. `manage_products` - Create, update, delete products
6. `view_products` - View products
7. `manage_master_products` - Manage master product categories
8. `manage_orders` - Create, update, delete orders
9. `view_orders` - View orders
10. `approve_orders` - Approve/reject orders
11. `manage_customers` - Create, update, delete customers
12. `view_customers` - View customers
13. `manage_inventory` - Manage stock and inventory
14. `view_inventory` - View inventory levels
15. `manage_material_inward` - Record material inward
16. `manage_material_discard` - Record material discard
17. `manage_production` - Manage production batches
18. `view_production` - View production data
19. `manage_bom` - Manage Bill of Materials
20. `view_reports` - Access reports and analytics
21. `export_data` - Export data to files
22. `manage_branches` - Manage branches
23. `manage_departments` - Manage departments
24. `manage_designations` - Manage designations
25. `manage_units` - Manage units of measurement
26. `system_settings` - Access system settings

### Role-Permission Mapping:

- **SuperAdmin:** ALL 26 permissions (full CRUD + lock)
- **Admin:** 24 permissions (excludes manage_permissions, system_settings)
- **Manager:** 7 permissions (view orders, manage orders, view products, view customers, view production, view inventory, view reports)
- **Sales:** 5 permissions (view/manage customers, view/manage orders, view products)

---

## 📚 ADDITIONAL SECURITY ENHANCEMENTS (Future)

### Optional but Recommended:

- [ ] Implement input validation middleware
  - [ ] Use `express-validator` for request validation
  - [ ] Create validation schemas for each endpoint

- [ ] Add CORS refinement
  - [ ] Restrict origins based on environment
  - [ ] Add allowed methods and headers

- [ ] Implement audit logging
  - [ ] Log all authentication attempts
  - [ ] Log all authorization failures
  - [ ] Log all data modifications

- [ ] Add request sanitization
  - [ ] Prevent SQL injection (Drizzle ORM helps)
  - [ ] Prevent XSS attacks
  - [ ] Prevent NoSQL injection

- [ ] Implement session management
  - [ ] Track active sessions
  - [ ] Allow session revocation
  - [ ] Implement "logout all devices"

- [ ] Add API key authentication (for external integrations)
  - [ ] Generate API keys for third-party access
  - [ ] Rate limit by API key

---

## ⚡ QUICK START GUIDE

### Step 1: Create Authentication Middleware

```bash
# File: server/src/middleware/auth.js
touch server/src/middleware/auth.js
```

### Step 2: Create Authorization Middleware

```bash
# File: server/src/middleware/permissions.js
touch server/src/middleware/permissions.js
```

### Step 3: Apply to Routes

Update each module's routes.js file to include authentication and authorization.

### Step 4: Test

```bash
# Test with Postman or similar tool
# 1. Login to get token
# 2. Try accessing protected routes with/without token
# 3. Try accessing routes with insufficient permissions
```

---

## 📞 NOTES

- **Current State:** All routes are publicly accessible - THIS IS A CRITICAL SECURITY VULNERABILITY
- **Database Ready:** Permission system is fully seeded and ready to use
- **Admin Credentials:** Username: `admin`, Password: `admin123` (SuperAdmin with full access)
- **Middleware Exists:** Rate limiters exist but not fully utilized
- **Next Step:** Implement authentication middleware ASAP

---

**Created:** December 7, 2025
**Last Updated:** December 7, 2025
**Priority Level:** 🔴 CRITICAL - SECURITY VULNERABILITY
