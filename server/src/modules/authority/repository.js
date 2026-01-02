import { eq, and } from 'drizzle-orm';
import db from '../../db/index.js';
import * as schema from '../../db/schema/index.js';

export class AuthorityRepository {
  /**
   * Find user by username with role
   */
  async findByUsername(username) {
    const result = await db
      .select({
        employee: schema.employees,
        role: schema.roles,
      })
      .from(schema.employees)
      .leftJoin(
        schema.employeeRoles,
        eq(schema.employees.employeeId, schema.employeeRoles.employeeId)
      )
      .leftJoin(schema.roles, eq(schema.employeeRoles.roleId, schema.roles.roleId))
      .where(eq(schema.employees.username, username))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Get user permissions
   */
  async getUserPermissions(employeeId) {
    const result = await db
      .select({
        permissionName: schema.permissions.permissionName,
        grantedActions: schema.rolePermissions.grantedActions,
      })
      .from(schema.employeeRoles)
      .innerJoin(
        schema.rolePermissions,
        eq(schema.employeeRoles.roleId, schema.rolePermissions.roleId)
      )
      .innerJoin(
        schema.permissions,
        eq(schema.rolePermissions.permissionId, schema.permissions.permissionId)
      )
      .where(eq(schema.employeeRoles.employeeId, employeeId));

    return result;
  }

  /**
   * Find user by employee ID
   */
  /**
   * Find user by employee ID
   */
  async findById(employeeId) {
    const result = await db
      .select({
        employee: schema.employees,
        role: schema.roles,
      })
      .from(schema.employees)
      .leftJoin(
        schema.employeeRoles,
        eq(schema.employees.employeeId, schema.employeeRoles.employeeId)
      )
      .leftJoin(schema.roles, eq(schema.employeeRoles.roleId, schema.roles.roleId))
      .where(eq(schema.employees.employeeId, employeeId))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Get all roles
   */
  async getAllRoles() {
    return await db.select().from(schema.roles);
  }

  /**
   * Get all permissions definition
   */
  async getAllPermissions() {
    return await db.select().from(schema.permissions);
  }

  /**
   * Get all role permissions (Matrix)
   */
  async getAllRolePermissions() {
    return await db
      .select({
        roleId: schema.rolePermissions.roleId,
        permissionId: schema.rolePermissions.permissionId,
        grantedActions: schema.rolePermissions.grantedActions,
      })
      .from(schema.rolePermissions);
  }

  /**
   * Update or Insert role permission
   * Uses delete-then-insert to avoid race conditions and constraint issues
   */
  async updateRolePermission(roleId, permissionId, grantedActions) {
    // First delete any existing row for this role+permission
    await db
      .delete(schema.rolePermissions)
      .where(
        and(
          eq(schema.rolePermissions.roleId, roleId),
          eq(schema.rolePermissions.permissionId, permissionId)
        )
      );

    // Then insert fresh row
    return await db
      .insert(schema.rolePermissions)
      .values({
        roleId,
        permissionId,
        grantedActions,
      })
      .returning();
  }

  /**
   * Get role by ID
   */
  async getRoleById(roleId) {
    const [role] = await db
      .select()
      .from(schema.roles)
      .where(eq(schema.roles.roleId, roleId))
      .limit(1);
    return role;
  }

  /**
   * Get role by name
   */
  async getRoleByName(roleName) {
    const [role] = await db
      .select()
      .from(schema.roles)
      .where(eq(schema.roles.roleName, roleName))
      .limit(1);
    return role;
  }

  /**
   * Create a new role
   */
  async createRole(roleData) {
    const [newRole] = await db.insert(schema.roles).values(roleData).returning();
    return newRole;
  }

  /**
   * Get permissions for a specific role
   */
  async getRolePermissionsById(roleId) {
    return await db
      .select({
        permissionId: schema.rolePermissions.permissionId,
        grantedActions: schema.rolePermissions.grantedActions,
      })
      .from(schema.rolePermissions)
      .where(eq(schema.rolePermissions.roleId, roleId));
  }

  /**
   * Get roles by department ID
   */
  async getRolesByDepartment(departmentId) {
    return await db.select().from(schema.roles).where(eq(schema.roles.departmentId, departmentId));
  }

  /**
   * Update a role
   */
  async updateRole(roleId, roleData) {
    const [updatedRole] = await db
      .update(schema.roles)
      .set(roleData)
      .where(eq(schema.roles.roleId, roleId))
      .returning();
    return updatedRole;
  }

  /**
   * Delete a role
   */
  async deleteRole(roleId) {
    // First delete role permissions
    await db.delete(schema.rolePermissions).where(eq(schema.rolePermissions.roleId, roleId));
    // Then delete the role
    await db.delete(schema.roles).where(eq(schema.roles.roleId, roleId));
  }
}
