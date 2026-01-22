import { Access } from "payload";

// Helper to check if user has roles (excludes MCP API keys)
const hasRoles = (user: unknown): user is { roles?: string[]; id: number } => {
  return user !== null && typeof user === 'object' && 'roles' in user;
}

export const adminOrSelf: Access = async ({ req: { user, payload } }) => {
  // Require user to be logged in
  if (!user) {
    return false;
  }
  // Check if user has roles (not an MCP API key)
  if (!hasRoles(user)) {
    return false;
  }
  // superadmin can update any user
  if (user.roles?.includes("superadmin")) {
    return true;
  }
  // admin can update any user except superadmin
  if (user.roles?.includes("admin")) {
    const nonSuperadminUsers = await payload.find({
      collection: "users",
      depth: 0,
      pagination: false,
      select: {},
      where: {
        roles: {
          not_equals: "superadmin",
        },
      }
    })

    const nonSuperadminUserIds = nonSuperadminUsers.docs.map((user) => user.id)

    return {
      id: {
        in: nonSuperadminUserIds,
      }
    };
  }
  // everyone can update self row
  return {
    id: {
      equals: user.id,
    },
  };
}

export const superadminOrAdminDelete: Access = async ({ req: { user, payload } }) => {
  // check if user is logged in
  if (!user) {
    return false
  }
  // Check if user has roles (not an MCP API key)
  if (!hasRoles(user)) {
    return false;
  }
  // superadmin can delete any user
  if (user.roles?.includes('superadmin')) {
    return true
  }
  //admin can delete any user except superadmin
  if (user.roles?.includes('admin')) {
    {
      const nonSuperAdminUsers = await payload.find({
        collection: 'users',
        select: {},
        pagination: false,
        depth: 0,
        where: {
          roles: {
            not_equals: 'superadmin',
          },
        },
      })

      const nonSuperAdminUsersIds = nonSuperAdminUsers.docs.map((user) => user.id)

      return {
        id: {
          in: nonSuperAdminUsersIds
        }
      }
    }
  }

  // if user is not superadmin or admin, return false
  return false
}