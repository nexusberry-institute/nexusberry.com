import { CollectionConfig } from 'payload';

export const Attendances: CollectionConfig = {
  slug: 'attendance',
  admin: {
    useAsTitle: 'date',
    listSearchableFields: ['batches', 'teacher'],
    group: 'Academic Operations',
    defaultColumns: ['date', 'batches', 'teacher', 'visible'],
    description: 'Manage class attendance sessions and online class links',
  },
  defaultSort: '-date',
  fields: [
    // ── Sidebar: always visible regardless of active tab ──
    {
      name: 'date',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'MMM dd, yyyy',
        },
      },
    },
    {
      name: 'teacher',
      type: 'relationship',
      relationTo: 'teachers',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'visible',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Show this session to students',
      },
    },
    {
      name: 'expiry',
      type: 'date',
      defaultValue: () => new Date(Date.now() + 90 * 60 * 1000),
      admin: {
        position: 'sidebar',
        description: 'Online class link auto-hides after this time',
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'p dd/MM/yyyy',
        },
      },
    },

    // ── Tabbed content ──
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Class Setup',
          fields: [
            {
              name: 'batches',
              type: 'relationship',
              relationTo: 'batches',
              required: true,
              hasMany: true,
              filterOptions: {
                active: { equals: true },
              },
              admin: {
                description: 'Select the batch(es) for this attendance session',
              },
            },
            {
              name: 'onlineClassLink',
              type: 'text',
              label: 'Online Class Link',
              admin: {
                description: 'Google Meet or Zoom link for the class',
              },
            },
            {
              name: 'users',
              type: 'relationship',
              relationTo: 'users',
              hasMany: true,
              label: 'Additional Students',
              filterOptions: {
                roles: {
                  equals: 'student',
                },
              },
              admin: {
                description:
                  'Grant access to specific students regardless of enrollment status',
              },
            },
            {
              name: 'staffNotes',
              type: 'textarea',
              label: 'Staff Notes',
              admin: {
                description: 'Internal notes — only visible to teachers and staff',
              },
            },
          ],
        },
        {
          label: 'Attendance Records',
          fields: [
            {
              name: 'relatedAttendanceDetails',
              type: 'join',
              collection: 'attendance-details',
              on: 'attendance',
              admin: {
                description:
                  'Individual student attendance entries for this session',
              },
            },
          ],
        },
      ],
    },
  ],
};
