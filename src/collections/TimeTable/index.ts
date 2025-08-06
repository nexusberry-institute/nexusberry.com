// import { checkAccess } from '@/access/accessControl';
import { CollectionConfig } from 'payload';

export const TimeTable: CollectionConfig = {
  slug: 'time-table',
  admin: {
    useAsTitle: 'day',
    group: "Academic Operations",
  },
  access: {
    // create: checkAccess('time-table', 'create'),
    // read: checkAccess('time-table', 'read'),
    // update: checkAccess('time-table', 'update'),
    // delete: checkAccess('time-table', 'delete'),
  },
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
    {
      name: "room",
      type: "text"
    },
  ],
};