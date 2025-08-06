// import { checkAccess } from '@/access/accessControl';
import { CollectionConfig } from 'payload';

export const Staffs: CollectionConfig = {
  slug: 'staffs',
  admin: {
    useAsTitle: 'fullName',
    group: "People Management",
  },
  access: {
    // create: checkAccess('staffs', 'create'),
    // read: checkAccess('staffs', 'read'),
    // update: checkAccess('staffs', 'update'),
    // delete: checkAccess('staffs', 'delete'),
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      required: true,
    },
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },
    {
      name: 'nick',
      type: 'text',
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'phoneNumber',
      type: 'text',
    },
    {
      name: 'address',
      type: 'group',
      fields: [
        {
          name: 'street',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
        },
        {
          name: 'state',
          type: 'text',
        },
        {
          name: 'zipCode',
          type: 'text',
        },
        {
          name: 'country',
          type: 'text',
        },
      ],
    },
    {
      name: 'profilePicture',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: "payMode",
      type: "select",
      options: [
        {
          label: "Fix",
          value: "FIX",
        },
        {
          label: "Per Admission",
          value: "PER_ADMISSION",
        },
        {
          label: "Fix plus per admission ",
          value: "FIX_PLUS_PER_ADMISSION",
        }
      ]
    },
    {
      name: "payPerAdmission",
      type: "number",
      min: 0
    },
    {
      name: "fixPay",
      type: "number",
      min: 0
    },
    {
      name: "note",
      type: "textarea",
    },
  ],
};

