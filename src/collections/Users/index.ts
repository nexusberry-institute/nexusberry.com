import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/checkRole'
import { authenticated } from '@/access/authenticated'
import { generateSetPasswordEmailHTML, generateSetPasswordEmailSubject } from '@/utilities/emailTemplates'
import { adminOrSelf, superadminOrAdminDelete } from '@/access'
import { protectRoles } from '@/hooks/protectRoles'
// import { admin } from '@/access/admin'


export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 28800, // 28800 secs = 8 hours
    forgotPassword: {
      generateEmailHTML: generateSetPasswordEmailHTML,
      generateEmailSubject: generateSetPasswordEmailSubject,
    },
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
      sameSite: 'None',
      secure: true,
    },
  },
  access: {
    read: authenticated, // Only logged in users can read
    // create: admin, // only admin can create accounts
    create: () => true, // anyone can create an account
    update: adminOrSelf, // everyone can update self row, admins can update any user except superadmin, superadmin can update any user
    delete: superadminOrAdminDelete, // admin can delete all except superadmin, superadmin can delete any user
    admin: ({ req: { user } }) => checkRole(['superadmin', 'admin'], user),
  },
  admin: {
    defaultColumns: ['username', 'email', 'roles', 'createdAt'],
    useAsTitle: 'email',
    group: "People Management"
  },
  defaultSort: "-createdAt",
  timestamps: true,
  fields: [
    {
      name: '_verified',
      type: 'checkbox',
      saveToJWT: true,
    },
    {
      name: 'blocked',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: "gmail_username",
      type: "text",
      defaultValue: "N/A"
    },
    {
      name: "provider",
      type: "select",
      options: ["local", "google"],
      defaultValue: "local"
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      defaultValue: ['student'],
      access: {
        create: ({ req: { user } }) => checkRole(['superadmin', 'admin'], user),
        update: ({ req: { user } }) => checkRole(['superadmin', 'admin'], user),
      },
      hooks: {
        beforeChange: [protectRoles], // apply above update access rules here
      },
      options: [
        {
          label: 'Super Admin',
          value: 'superadmin',
        },
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Developer',
          value: 'developer',
        },
        {
          label: 'Operations',
          value: 'operations',
        },
        {
          label: 'Accountant',
          value: 'accountant',
        },
        {
          label: 'CSR',
          value: 'csr',
        },
        {
          label: 'Teacher',
          value: 'teacher',
        },
        {
          label: 'Student',
          value: 'student',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
    },
    {
      name: 'photo',
      label: 'User Photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'is_active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}