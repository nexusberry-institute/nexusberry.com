import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { jwtDecode } from "jwt-decode"
import { roleDefaultPaths, routePermissions } from './constants';

interface DecodedToken {
  id: number;
  collection: string;
  email: string;
  roles: string[];
  _verified: boolean;
  iat: number;
  exp: number;
}


export function middleware(request: NextRequest) {
  const token = request.cookies.get('payload-token')
  const pathName = request.nextUrl.pathname

  // Check if the URL already has a toast parameter to prevent redirect loops
  const hasToastParam = request.nextUrl.searchParams.has('toast')

  if (token) {
    const { _verified } = jwtDecode(token.value) as DecodedToken
    if (!_verified) {
      return NextResponse.redirect(
        new URL(`/?toast=${encodeURIComponent("Your account is not verified yet. Please check your email for a verification link to activate your account")}&toastType=warning&redirectTo=${pathName}`,
          request.url))
    }
  }

  // Handle login Route if already logged in
  if (pathName === "/login") {
    if (token) {
      try {
        const { roles } = jwtDecode(token.value) as DecodedToken
        // Find the user's primary role
        const primaryRole = Object.keys(roleDefaultPaths).find(role => roles.includes(role)) || 'user'
        const redirectPath = roleDefaultPaths[primaryRole as keyof typeof roleDefaultPaths]

        return NextResponse.redirect(
          new URL(`${redirectPath}?toast=${encodeURIComponent("You are already logged in")}&toastType=warning`,
            request.url))

      } catch (error) {
        // If token decoding fails, treat as not logged in
        return NextResponse.next()
      }
    } else {
      return NextResponse.next()
    }
  }

  // For non-login pages, check authentication
  if (!token) {
    return NextResponse.redirect(
      new URL(`/login?toast=${encodeURIComponent("You need to be logged in to access this page")}&toastType=warning&redirectTo=${pathName}`,
        request.url))
  }

  try {
    const { roles } = jwtDecode(token.value) as DecodedToken

    // Check if user has permission to access the current path
    const hasAccess = Object.entries(routePermissions).some(([route, allowedRoles]) => {
      if (pathName.startsWith(route)) {
        return roles.some(role => allowedRoles.includes(role))
      }
      return false
    })

    if (!hasAccess && !hasToastParam) {
      // Find the user's primary role (first match in our priority list)
      const primaryRole = Object.keys(roleDefaultPaths).find(role => roles.includes(role)) || 'user'
      const redirectPath = roleDefaultPaths[primaryRole as keyof typeof roleDefaultPaths]

      return NextResponse.redirect(
        new URL(`${redirectPath}?toast=${encodeURIComponent("You don't have permission to access this area")}&toastType=error`,
          request.url))
    }
  } catch (error) {
    // If token is invalid, redirect to login
    return NextResponse.redirect(
      new URL(`/login?toast=${encodeURIComponent("Your session is invalid. Please log in again.")}&toastType=error`,
        request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/account/:path*',
    '/accounts/:path*',
    '/cms/:path*',
    '/coursework/:path*',
    '/lms/:path*',
    '/reports/:path*',
    '/admin/:path*',
    '/login',
  ],
}



// Current reason for comment: This page isn’t working right now
// localhost redirected you too many times.
// Middleware to handle authentication and authorization in a centralized way.

// import type { NextRequest } from 'next/server'
// import { NextResponse } from 'next/server'
// import { jwtDecode } from "jwt-decode"

// interface DecodedToken {
//   id: number;
//   collection: string;
//   email: string;
//   roles: string[];
//   iat: number;
//   exp: number;
// }

// // Define route access permissions in a centralized, configurable way
// const routePermissions = {
//   '/admin': ['superadmin', 'admin', 'developer'],
//   '/cms': ['superadmin', 'admin', 'developer', 'operations', 'csr'],
//   '/accounts': ['superadmin', 'admin', 'developer', 'operations', 'accountant'],
//   '/lms': ['developer', 'student', 'teacher'],
//   '/reports': ['superadmin', 'admin', 'operations'],
//   '/coursework': ['developer', 'student', 'teacher'],
// }

// // Default redirect paths based on primary role
// const roleDefaultPaths = {
//   'superadmin': '/admin',
//   'admin': '/admin',
//   'developer': '/admin',
//   'operations': '/accounts',
//   'accountant': '/accounts',
//   'csr': '/cms',
//   'student': '/lms',
//   'user': '/logout',
// }

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get('payload-token')
//   const pathName = request.nextUrl.pathname

//   if (!token) {
//     return NextResponse.redirect(
//       new URL(`/login?toast=${encodeURIComponent("You need to be logged in to access this page")}&toastType=warning&redirectTo=${pathName}`,
//         request.url))
//   }

//   const { roles } = jwtDecode(token.value) as DecodedToken

//   if (pathName === "/login") {
//     // Find the user's primary role
//     const primaryRole = Object.keys(roleDefaultPaths).find(role => roles.includes(role)) || 'user'
//     const redirectPath = roleDefaultPaths[primaryRole as keyof typeof roleDefaultPaths]

//     return NextResponse.redirect(
//       new URL(`${redirectPath}?toast=${encodeURIComponent("You are already logged in. Redirecting to your default page.")}&toastType=warning`,
//         request.url))
//   }

//   // Check if user has permission to access the current path
//   const hasAccess = Object.entries(routePermissions).some(([route, allowedRoles]) => {
//     if (pathName.startsWith(route)) {
//       return roles.some(role => allowedRoles.includes(role))
//     }
//     return false
//   })

//   if (!hasAccess) {
//     // Find the user's primary role (first match in our priority list)
//     const primaryRole = Object.keys(roleDefaultPaths).find(role => roles.includes(role)) || 'user'
//     const redirectPath = roleDefaultPaths[primaryRole as keyof typeof roleDefaultPaths]

//     return NextResponse.redirect(
//       new URL(`${redirectPath}?toast=${encodeURIComponent("You don't have permission to access this area")}&toastType=error`,
//         request.url))
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: [
//     '/account/:path*',
//     '/accounts/:path*',
//     '/cms/:path*',
//     '/coursework/:path*',
//     '/lms/:path*',
//     '/reports/:path*',
//     '/admin/:path*',
//     '/login',
//   ],
// }
