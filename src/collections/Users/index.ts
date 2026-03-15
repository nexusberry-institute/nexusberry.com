import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/checkRole'
import { authenticated } from '@/access/authenticated'
import { adminOrSelf, superadminOrAdminDelete } from '@/access'
import { protectRoles } from '@/hooks/protectRoles'
import { trackLogin } from '@/hooks/trackLogin'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 28800, // 28800 secs = 8 hours
    verify: {
      generateEmailSubject: () => 'Nexusberry Email Verification',
      generateEmailHTML: ({ user, token }) => `<h1>Hey! ${user.email} Verify your email</h1><p>Click <a href='${process.env.NEXT_PUBLIC_SERVER_URL || ''}/verify?token=${token}'>here</a> to verify your email.</p>`,

    }, // Require email verification before being allowed to authenticate
    maxLoginAttempts: 5, // Automatically lock a user out after X amount of failed logins. Set to 0 to disable.
    lockTime: 600 * 1000, // Time period to allow the max login attempts. time (in milliseconds)
    loginWithUsername: {
      allowEmailLogin: true, // default: false. If set to true, users can log in with either their username or email address. If set to false, users can only log in with their username.
      requireEmail: true, // default: false. If set to true, an email address is required when creating a new user. If set to false, email is not required upon creation
      requireUsername: false, // default: false. If set to true, a username is required when creating a new user. If set to false, username is not required upon creation
    },
    cookies: {
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  hooks: {
    afterLogin: [trackLogin],
  },
  access: {
    read: authenticated, // Only logged in users can read
    create: () => true, // anyone can create an account
    update: adminOrSelf, // everyone can update self row, admins can update any user except superadmin, superadmin can update any user
    delete: superadminOrAdminDelete, // admin can delete all except superadmin, superadmin can delete any user
    admin: ({ req: { user } }) => checkRole(['superadmin', 'admin'], user),
  },
  admin: {
    defaultColumns: ['id', 'email', 'gmail_username', 'provider', 'roles', 'blocked', 'lastLoginAt', 'loginCount', 'createdAt'],
    listSearchableFields: ['email', 'gmail_username'],
    useAsTitle: 'email',
    group: "People Management"
  },
  defaultSort: "-createdAt",
  timestamps: true,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Profile',
          fields: [
            {
              name: "gmail_username",
              type: "text",
              label: "Gmail Username",
              defaultValue: "N/A",
            },
            {
              name: 'photo',
              label: 'User Photo',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          label: 'Insights',
          fields: [
            {
              name: 'lastLoginAt',
              type: 'date',
              label: 'Last Login',
              admin: {
                readOnly: true,
                date: {
                  displayFormat: 'd MMM yyyy, h:mm a',
                },
              },
            },
            {
              name: 'loginCount',
              type: 'number',
              label: 'Login Count',
              defaultValue: 0,
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'sessionToken',
              type: 'text',
              admin: { hidden: true },
            },
          ],
        },
      ],
    },
    // --- Sidebar fields ---
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      defaultValue: ['authenticated'],
      access: {
        create: ({ req: { user } }) => checkRole(['superadmin', 'admin'], user),
        update: ({ req: { user } }) => checkRole(['superadmin', 'admin'], user),
      },
      hooks: {
        beforeChange: [protectRoles],
      },
      options: [
        { label: 'Super Admin', value: 'superadmin' },
        { label: 'Admin', value: 'admin' },
        { label: 'Developer', value: 'developer' },
        { label: 'Operations', value: 'operations' },
        { label: 'Accountant', value: 'accountant' },
        { label: 'CSR', value: 'csr' },
        { label: 'Teacher', value: 'teacher' },
        { label: 'Student', value: 'student' },
        { label: 'Authenticated', value: 'authenticated' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: "provider",
      type: "select",
      options: ["local", "google"],
      defaultValue: "local",
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: '_verified',
      type: 'checkbox',
      label: 'Email Verified',
      saveToJWT: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'blocked',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Staff can block this user temporarily, e.g. if defaulter',
      },
    },
    {
      name: 'trialTutorials',
      type: 'relationship',
      relationTo: 'tutorials',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Protected tutorials this user can access on a trial basis.',
      },
    },
    {
      name: 'student',
      type: 'join',
      collection: 'students',
      on: 'user',
      admin: {
        condition: (data) => Array.isArray(data?.roles) && data.roles.includes('student'),
      },
    },
  ],
}