/**
 * Seed Departments and Roles Script
 *
 * This script seeds the 4 core system departments and their default roles.
 * Run: node scripts/seed-departments-roles.js
 */

import db from '../src/db/index.js';
import { departments } from '../src/db/schema/organization/departments.js';
import { roles } from '../src/db/schema/auth/roles.js';
import { eq } from 'drizzle-orm';

const SYSTEM_DEPARTMENTS = [
  { departmentName: 'Administration', isSystemDepartment: true, isActive: true },
  { departmentName: 'Production', isSystemDepartment: true, isActive: true },
  { departmentName: 'Accounts', isSystemDepartment: true, isActive: true },
  { departmentName: 'Sales & Marketing', isSystemDepartment: true, isActive: true },
];

const SYSTEM_ROLES = [
  {
    roleName: 'Admin',
    description: 'System administrator with full access',
    departmentName: 'Administration',
    landingPage: '/dashboard/admin',
    isSalesRole: false,
    isSupervisorRole: false,
    isSystemRole: true,
  },
  {
    roleName: 'SuperAdmin',
    description: 'System administrator with full access',
    departmentName: 'Administration',
    landingPage: '/dashboard/admin',
    isSalesRole: false,
    isSupervisorRole: false,
    isSystemRole: true,
  },
  {
    roleName: 'Production Manager',
    description: 'Manages production operations and supervises workers',
    departmentName: 'Production',
    landingPage: '/operations/accepted-orders',
    isSalesRole: false,
    isSupervisorRole: true,
    isSystemRole: true,
  },
  {
    roleName: 'Accounts Manager',
    description: 'Manages accounts and financial operations',
    departmentName: 'Accounts',
    landingPage: '/operations/admin-accounts',
    isSalesRole: false,
    isSupervisorRole: false,
    isSystemRole: true,
  },
  {
    roleName: 'Sales Person',
    description: 'Sales team member, handles customer orders',
    departmentName: 'Sales & Marketing',
    landingPage: '/operations/create-order',
    isSalesRole: true,
    isSupervisorRole: false,
    isSystemRole: true,
  },
];

async function seedDepartments() {
  console.log('🔄 Seeding departments...');

  for (const dept of SYSTEM_DEPARTMENTS) {
    try {
      // Check if department already exists
      const existing = await db
        .select()
        .from(departments)
        .where(eq(departments.departmentName, dept.departmentName))
        .limit(1);

      if (existing.length > 0) {
        // Update to mark as system department
        await db
          .update(departments)
          .set({ isSystemDepartment: true })
          .where(eq(departments.departmentName, dept.departmentName));
        console.log(`  ✓ Updated existing department: ${dept.departmentName}`);
      } else {
        // Insert new department
        await db.insert(departments).values(dept);
        console.log(`  ✓ Created department: ${dept.departmentName}`);
      }
    } catch (error) {
      console.error(`  ✗ Error with department ${dept.departmentName}:`, error.message);
    }
  }
}

async function seedRoles() {
  console.log('🔄 Seeding roles...');

  // Get department IDs
  const deptList = await db.select().from(departments);
  const deptMap = {};
  for (const d of deptList) {
    deptMap[d.departmentName] = d.departmentId;
  }

  for (const role of SYSTEM_ROLES) {
    try {
      const departmentId = deptMap[role.departmentName];

      if (!departmentId) {
        console.error(`  ✗ Department not found for role ${role.roleName}: ${role.departmentName}`);
        continue;
      }

      // Check if role already exists
      const existing = await db
        .select()
        .from(roles)
        .where(eq(roles.roleName, role.roleName))
        .limit(1);

      if (existing.length > 0) {
        // Update existing role with new flags and landing page
        await db
          .update(roles)
          .set({
            departmentId,
            landingPage: role.landingPage,
            isSalesRole: role.isSalesRole,
            isSupervisorRole: role.isSupervisorRole,
            isSystemRole: role.isSystemRole,
            description: role.description,
          })
          .where(eq(roles.roleName, role.roleName));
        console.log(`  ✓ Updated existing role: ${role.roleName}`);
      } else {
        // Insert new role
        await db.insert(roles).values({
          roleName: role.roleName,
          description: role.description,
          departmentId,
          landingPage: role.landingPage,
          isSalesRole: role.isSalesRole,
          isSupervisorRole: role.isSupervisorRole,
          isSystemRole: role.isSystemRole,
          isActive: true,
        });
        console.log(`  ✓ Created role: ${role.roleName}`);
      }
    } catch (error) {
      console.error(`  ✗ Error with role ${role.roleName}:`, error.message);
    }
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║  Seed Departments & Roles Script           ║');
  console.log('╚════════════════════════════════════════════╝\n');

  try {
    await seedDepartments();
    console.log('');
    await seedRoles();
    console.log('\n✅ Seeding completed successfully!');
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

main();
