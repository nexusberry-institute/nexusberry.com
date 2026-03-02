import { CollectionConfig } from 'payload';

export const TimeTable: CollectionConfig = {
  slug: 'time-table',
  admin: {
    useAsTitle: 'day',
    group: "Academic Operations",
    defaultColumns: ['batch', 'day', 'startTime', 'endTime'],
  },
  access: {},
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'batch',
          type: 'relationship',
          relationTo: 'batches',
          required: true,
          hasMany: false
        },
        {
          name: 'day',
          type: 'select',
          required: true,
          options: [
            "MONDAY", "TUESDAY",
            "WEDNESDAY", "THURSDAY",
            "FRIDAY", "SATURDAY", "SUNDAY"
          ],
        },
      ]
    },
    {
      type: "row",
      fields: [
        {
          name: 'startTime',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'timeOnly',
              displayFormat: 'p',
              timeIntervals: 30,
            },
          }
        },
        {
          name: 'endTime',
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
              return "End time must be greater than start time"
            }
            return true
          }
        },
      ]
    },
  ],
};
