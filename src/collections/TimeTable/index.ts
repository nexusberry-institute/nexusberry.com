import { CollectionConfig } from 'payload';

export const TimeTable: CollectionConfig = {
  slug: 'time-table',
  admin: {
    useAsTitle: 'day',
    listSearchableFields: ['batch', 'day'],
    group: 'Academic Operations',
    defaultColumns: ['batch', 'day', 'startTime', 'endTime'],
    description: 'Weekly class schedule entries per batch',
  },
  access: {},
  fields: [
    // ── Sidebar: day selection ──
    {
      name: 'day',
      type: 'select',
      required: true,
      options: [
        { label: 'Monday', value: 'MONDAY' },
        { label: 'Tuesday', value: 'TUESDAY' },
        { label: 'Wednesday', value: 'WEDNESDAY' },
        { label: 'Thursday', value: 'THURSDAY' },
        { label: 'Friday', value: 'FRIDAY' },
        { label: 'Saturday', value: 'SATURDAY' },
        { label: 'Sunday', value: 'SUNDAY' },
      ],
      admin: {
        position: 'sidebar',
      },
    },

    // ── Main content ──
    {
      name: 'batch',
      type: 'relationship',
      relationTo: 'batches',
      required: true,
      hasMany: false,
      admin: {
        description: 'The batch this schedule entry belongs to',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startTime',
          label: 'Start Time',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'timeOnly',
              displayFormat: 'p',
              timeIntervals: 30,
            },
          },
        },
        {
          name: 'endTime',
          label: 'End Time',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'timeOnly',
              displayFormat: 'p',
              timeIntervals: 30,
            },
          },
          validate: (value, { data }: any) => {
            if (data.startTime && data.startTime > (value || 0)) {
              return 'End time must be greater than start time';
            }
            return true;
          },
        },
      ],
    },
  ],
};
