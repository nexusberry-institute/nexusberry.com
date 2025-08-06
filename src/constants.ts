// Define route access permissions in a centralized, configurable way
export const routePermissions = {
  '/admin': ['superadmin', 'admin', 'developer'],
  '/cms': ['superadmin', 'admin', 'developer', 'operations', 'csr'],
  '/accounts': ['superadmin', 'admin', 'developer', 'operations', 'accountant'],
  '/lms': ['developer', 'student', 'teacher'],
  '/reports': ['superadmin', 'admin', 'operations'],
  '/coursework': ['developer', 'student', 'teacher'],
}

// Default redirect paths based on primary role
export const roleDefaultPaths = {
  'superadmin': '/admin',
  'admin': '/admin',
  'developer': '/admin',
  'operations': '/accounts',
  'accountant': '/accounts',
  'csr': '/cms',
  'student': '/lms/dashboard',
  'user': '/logout',
}