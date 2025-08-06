// import { checkAccess } from '@/access/accessControl';
import { CollectionConfig } from 'payload';

export const Teachers: CollectionConfig = {
  slug: 'teachers',
  admin: {
    group: "People Management",
    useAsTitle: 'nick',
    listSearchableFields: ['fullName', 'nick', 'phoneNumber', "user.email"],
  },
  access: {
    // create: checkAccess('teachers', 'create'),
    // read: checkAccess('teachers', 'read'),
    // update: checkAccess('teachers', 'update'),
    // delete: checkAccess('teachers', 'delete'),
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
      required: true,
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
      type: "radio",
      options: [
        {
          label: "Fix",
          value: "FIX",
        },
        {
          label: "Per Lecture",
          value: "PER_LECTURE",
        }
      ]
    },
    {
      name: "payPerLecture",
      type: "number",
      min: 0,
    },
    {
      name: "fixPay",
      type: "number",
      min: 0,
    },
    {
      name: 'note',
      type: 'textarea',
    },
    // {
    //   name: "status",
    //   type: "select",
    //   options: [
    //     {
    //       label: "Active",
    //       value: "ACTIVE",
    //     },
    //     {
    //       label: "Inactive",
    //       value: "INACTIVE",
    //     },
    //   ],
    // },
  ],
};

