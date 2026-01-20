import { APIError, FieldHook } from "payload";

// export const protectRoles: FieldHook = async ({ data, req: { user }, originalDoc }) => {
//   // Skip if no roles are being modified
//   if (!data?.roles) return data;

//   // skip if user is superadmin
//   if (user?.roles?.includes('superadmin')) return data;

//   if (originalDoc) {
//     // Check if superadmin role is being removed
//     if (!data.roles.includes('superadmin') && originalDoc.roles.includes('superadmin')) {
//       throw new APIError(
//         'You are not allowed to remove the superadmin role',
//         403,
//         {
//           field: 'roles',
//           message: 'You are not allowed to remove the superadmin role',
//         }
//       );
//     }
//   }

//   // Check if superadmin role is being assigned
//   if (data.roles.includes('superadmin')) {
//     throw new APIError(
//       'You are not allowed to assign the superadmin role',
//       403,
//       {
//         field: 'roles',
//         message: 'You are not allowed to assign the superadmin role',
//       }
//     );
//   }

//   return data;
// };


export const protectRoles: FieldHook = async ({ data, req: { user }, originalDoc }) => {
  // Skip if no roles are being modified
  if (!data?.roles) return;

  // Allow superadmins to perform any role changes
  if (user?.roles?.includes('superadmin')) return;

  // Allow system-level operations (e.g., onInit seeding) when no user is authenticated
  // This enables the initial superadmin creation during build/startup
  if (!user) return;

  // Create error formatter for consistent error structure
  const throwRolesError = (message: string) => {
    throw new APIError(
      message,
      403,
      {
        "name": "ValidationError",
        "data": {
          "collection": "users",
          "errors": [
            {
              "label": "Roles",
              "message": "This field is required.",
              "path": "roles"
            }
          ]
        },
        "message": "The following field is invalid: Roles"
      }
    );
  };

  // Check if superadmin role is being removed from existing user
  if (originalDoc?.roles?.includes('superadmin') && !data.roles.includes('superadmin')) {
    throwRolesError('You cannot remove the superadmin role');
  }

  // Check if superadmin role is being assigned
  if (data.roles.includes('superadmin')) {
    throwRolesError('You cannot assign the superadmin role');
  }

  return;
};