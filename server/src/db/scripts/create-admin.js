import db from '../index.js';
import {
  employees,
  roles,
  permissions,
  rolePermissions,
  employeeRoles,
  departments,
} from '../schema/index.js';
import { hashValue } from '../../utils/encryption.js';
import { eq } from 'drizzle-orm';
import { fileURLToPath } from 'url';

console.log('create-admin.js starting', {
  argv: process.argv.slice(1),
  cwd: process.cwd(),
  env: process.env.NODE_ENV,
});

async function createAdmin() {
  try {
    console.log('Checking for existing admin user...');
    const [existing] = await db.select().from(employees).where(eq(employees.username, 'admin'));
    console.log('Existing admin user:', existing);
    const hashed = await hashValue('admin123');
    console.log('Hashed password:', hashed);
    let employeeRecord = existing;
    if (existing) {
      // Update password and status if user exists
      console.log('Admin exists, updating password and status...');
      const [updated] = await db
        .update(employees)
        .set({
          passwordHash: hashed,
          status: 'Active',
        })
        .where(eq(employees.username, 'admin'))
        .returning();
      console.log('Admin user already existed. Password reset and status set to Active:', updated);
      employeeRecord = updated;
    } else {
      console.log('No admin found, inserting new admin...');
      const [inserted] = await db
        .insert(employees)
        .values({
          firstName: 'Super',
          lastName: 'Admin',
          username: 'admin',
          passwordHash: hashed,
          mobileNo: ['9999999999', null, null],
          emailId: 'admin@dmor.com',
          status: 'Active',
        })
        .returning();
      console.log('Inserted admin user:', inserted);
      employeeRecord = inserted;
    }

    // Ensure Administrator department exists
    console.log('Ensuring Administrator department exists...');
    let [adminDept] = await db
      .select()
      .from(departments)
      .where(eq(departments.departmentName, 'Administrator'));
    if (!adminDept) {
      console.log('Administrator department not found, creating it...');
      const [newDept] = await db
        .insert(departments)
        .values({ departmentName: 'Administrator', isActive: true })
        .returning();
      adminDept = newDept;
      console.log('Created Administrator department:', adminDept);
    } else {
      console.log('Found Administrator department:', adminDept);
    }

    // Ensure SuperAdmin role exists and is linked to Administrator dept and landingPage
    console.log('Ensuring SuperAdmin role exists and is configured...');
    let [superRole] = await db.select().from(roles).where(eq(roles.roleName, 'SuperAdmin'));
    if (!superRole) {
      console.log('SuperAdmin role not found, creating it...');
      const [newRole] = await db
        .insert(roles)
        .values({
          roleName: 'SuperAdmin',
          description: 'Super administrator with all permissions',
          isActive: true,
          departmentId: adminDept.departmentId,
          landingPage: '/dashboard/admin',
        })
        .returning();
      superRole = newRole;
      console.log('Created SuperAdmin role:', superRole);
    } else {
      // make sure departmentId and landingPage are set correctly
      console.log('Found SuperAdmin role, ensuring department and landingPage are set...');
      const updateData = {};
      if (superRole.departmentId !== adminDept.departmentId)
        updateData.departmentId = adminDept.departmentId;
      if (superRole.landingPage !== '/dashboard/admin') updateData.landingPage = '/dashboard/admin';
      if (Object.keys(updateData).length > 0) {
        const [updatedRole] = await db
          .update(roles)
          .set(updateData)
          .where(eq(roles.roleId, superRole.roleId))
          .returning();
        superRole = updatedRole;
        console.log('Updated SuperAdmin role:', superRole);
      } else {
        console.log('SuperAdmin role already configured correctly');
      }
    }

    // Assign role to the user if not already assigned
    console.log('Assigning role to admin if missing...');
    const existingRoleAssign = await db
      .select()
      .from(employeeRoles)
      .where(eq(employeeRoles.employeeId, employeeRecord.employeeId));
    const hasRole =
      existingRoleAssign && existingRoleAssign.some(r => r.roleId === superRole.roleId);
    if (!hasRole) {
      const [er] = await db
        .insert(employeeRoles)
        .values({ employeeId: employeeRecord.employeeId, roleId: superRole.roleId })
        .returning();
      console.log('Assigned SuperAdmin role to admin:', er);
    } else {
      console.log('Admin already has SuperAdmin role');
    }

    // Ensure the employee is in the Administrator department
    if (employeeRecord.departmentId !== adminDept.departmentId) {
      console.log('Updating admin user department to Administrator...');
      const [updatedEmployee] = await db
        .update(employees)
        .set({ departmentId: adminDept.departmentId })
        .where(eq(employees.employeeId, employeeRecord.employeeId))
        .returning();
      console.log('Updated admin employee department:', updatedEmployee);
      employeeRecord = updatedEmployee;
    } else {
      console.log('Admin is already assigned to Administrator department');
    }

    // Grant all permissions to the SuperAdmin role
    console.log('Granting all permissions to SuperAdmin role...');
    const allPerms = await db.select().from(permissions);
    for (const perm of allPerms) {
      const existingRP = await db
        .select()
        .from(rolePermissions)
        .where(eq(rolePermissions.roleId, superRole.roleId))
        .then(rows => rows.find(rp => rp.permissionId === perm.permissionId));
      if (!existingRP) {
        const [rpInserted] = await db
          .insert(rolePermissions)
          .values({
            roleId: superRole.roleId,
            permissionId: perm.permissionId,
            grantedActions: perm.availableActions || [],
          })
          .returning();
        console.log('Granted permission', perm.permissionName, 'to SuperAdmin:', rpInserted);
      }
    }
  } catch (err) {
    console.error('Failed to create or update admin user:', err);
    if (err && err.stack) console.error(err.stack);
    process.exitCode = 1;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log('create-admin.js invoked directly, running createAdmin()');
  createAdmin()
    .then(() => {
      console.log('create-admin.js finished successfully');
      process.exit(0);
    })
    .catch(err => {
      console.error('create-admin.js failed', err);
      process.exit(1);
    });
}
