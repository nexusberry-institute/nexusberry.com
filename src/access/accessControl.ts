// import { Access, FieldAccess } from 'payload';
// import { User, RolePermission } from '../payload-types';

// type ActionType = 'create' | 'read' | 'update' | 'delete';

// type FieldPermission = {
//     fieldName: string;
//     write: boolean;
// };

// type CollectionPermission = {
//     collection: string;
//     create: boolean;
//     read: boolean;
//     update: boolean;
//     delete: boolean;
//     fields: FieldPermission[];
// };

// const getRolePermissions = async (payload: any, roleIds: string[]): Promise<CollectionPermission[]> => {
//     const roles = await payload.find({
//         collection: 'roles',
//         where: {
//             id: {
//                 in: roleIds,
//             },
//         },
//         depth: 1,
//     });

//     let permissions: CollectionPermission[] = [];

//     for (const role of roles.docs) {
//         if (role.role_permissions) {
//             const rolePermissions = await payload.find({
//                 collection: 'role_permissions',
//                 where: {
//                     id: {
//                         in: role.role_permissions.map((p: any) => p.id),
//                     },
//                 },
//             });

//             permissions = permissions.concat(rolePermissions.docs.flatMap((p: RolePermission) => p.collections));
//         }
//     }

//     return permissions;
// };

// const hasCollectionPermission = (permissions: CollectionPermission[], collection: string, action: ActionType): boolean => {
//     return permissions.some((permission) =>
//         permission.collection === collection && permission[action]
//     );
// };

// const isAdmin = (user: User): boolean => {
//     return user.roles?.some((role: any) => role.name === 'admin') ?? false;
// };

// export const checkAccess = (collection: string, desiredPermission: ActionType): Access => async ({ req: { user, payload } }) => {
//     if (!user) return false;
//     if (isAdmin(user)) return true;

//     const roleIds = user.roles?.map((role) => role.id) || [];
//     const rolePermissions = await getRolePermissions(payload, roleIds);

//     return hasCollectionPermission(rolePermissions, collection, desiredPermission);
// };

// export const checkFieldAccess = (collection: string, fieldName: string): FieldAccess => async ({ req: { user, payload } }) => {
//     if (!user) return false;
//     if (isAdmin(user)) return true;

//     const roleIds = user.roles?.map((role: any) => role.id) || [];
//     const permissions = await getRolePermissions(payload, roleIds);

//     return permissions.some((permission) =>
//         permission.collection === collection &&
//         permission.fields.some((field) => field.fieldName === fieldName && field.write)
//     );
// };

