import { CollectionConfig } from 'payload';
// import { checkAccess } from '@/access/accessControl';

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'message',
    group: 'Notifications',
  },
  access: {
    // create: checkAccess('notifications', 'create'),
    // read: checkAccess('notifications', 'read'),
    // update: checkAccess('notifications', 'update'),
    // delete: checkAccess('notifications', 'delete'),
  },
  fields: [
    {
      name: 'message',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Course Update', value: 'course_update' },
        { label: 'Assignment', value: 'assignment' },
        { label: 'Grade', value: 'grade' },
        { label: 'Administrative', value: 'administrative' },
        { label: 'System', value: 'system' },
        { label: 'Reminder', value: 'reminder' },
        { label: 'Custom', value: 'custom' },
      ],
      required: true,
    },
    {
      name: 'recipients',
      type: 'relationship',
      relationTo: ['students', 'batches'],
      hasMany: true,
      required: true,
    },
    {
      name: 'priority',
      type: 'select',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Normal', value: 'normal' },
        { label: 'High', value: 'high' },
        { label: 'Critical', value: 'critical' },
      ],
      defaultValue: 'normal',
      required: true,
    },
    {
      name: 'isRead',
      type: 'array',
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
        },
        {
          name: 'readAt',
          type: 'date',
        },
      ],
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional data for advanced use cases.',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data.createdAt) {
          data.createdAt = new Date();
        }
        return data;
      },
    ],
    afterRead: [
      async ({ doc, req }) => {
        // Example hook to populate dynamic fields
        doc.isRead = doc.isRead || [];
        return doc;
      },
    ],
  },
};
