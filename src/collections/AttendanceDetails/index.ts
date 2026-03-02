import { CollectionConfig } from 'payload';
import { checkRole } from '@/access/checkRole';
import { authenticated } from '@/access/authenticated';

export const AttendanceDetails: CollectionConfig = {
  slug: 'attendance-details',
  access: {
    create: ({ req: { user } }) =>
      checkRole(['superadmin', 'admin', 'operations', 'teacher'], user),
    read: authenticated,
    update: ({ req: { user } }) =>
      checkRole(['superadmin', 'admin', 'operations', 'teacher'], user),
    delete: ({ req: { user } }) =>
      checkRole(['superadmin', 'admin', 'operations', 'teacher'], user),
  },
  admin: {
    useAsTitle: 'student',
    listSearchableFields: ['student', 'attendance'],
    group: 'Academic Operations',
    defaultColumns: ['student', 'attendance', 'status', 'medium', 'joinedAt'],
    description: 'Individual student attendance entries per session',
  },
  fields: [
    // ── Sidebar: quick-glance metadata ──
    {
      name: 'status',
      type: 'select',
      defaultValue: 'ABSENT',
      options: [
        { label: 'Present', value: 'PRESENT' },
        { label: 'Absent', value: 'ABSENT' },
        { label: 'Leave', value: 'LEAVE' },
      ],
      admin: {
        position: 'sidebar',
        components: {
          Cell: '@/fields/AttendanceStatusField/AttendanceStatusCell.tsx#AttendanceStatusCell',
        },
      },
    },
    {
      name: 'medium',
      type: 'radio',
      defaultValue: 'ONLINE',
      options: [
        { label: 'Physical', value: 'PHYSICAL' },
        { label: 'Online', value: 'ONLINE' },
      ],
      admin: {
        position: 'sidebar',
        description: 'How the student attended',
      },
    },
    {
      name: 'joinedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'p dd/MM/yyyy',
        },
        description: 'Auto-set when student joins online class',
      },
    },

    // ── Main content ──
    {
      name: 'attendance',
      type: 'relationship',
      relationTo: 'attendance',
      hasMany: false,
      required: true,
      admin: {
        description: 'The attendance session this entry belongs to',
      },
    },
    {
      name: 'student',
      type: 'relationship',
      relationTo: 'students',
      hasMany: false,
      required: true,
      index: true,
    },
  ],
};
