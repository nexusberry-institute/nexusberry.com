import { CollectionConfig } from 'payload'

export const Assignments: CollectionConfig = {
  slug: 'assignments',
  admin: {
    group: "Classwork",
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'status',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar'
      }
    },
    {
      type: 'tabs',
      tabs: [
        {
          name: 'Basic Info',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'files',
              type: 'upload',
              relationTo: 'media',
              hasMany: true
            },
            {
              name: 'tags',
              type: 'text',
              hasMany: true
            },
            {
              name: "module",
              type: "relationship",
              relationTo: "modules",
            },
            {
              name: "moduleTopic",
              type: "relationship",
              relationTo: "module-topics",
            },
            {
              name: "lecture",
              type: "relationship",
              relationTo: "lectures",
            }
          ]
        },
        {
          name: 'Questions',
          fields: [
            {
              name: 'questions',
              type: 'array',
              fields: [
                {
                  name: 'question',
                  type: 'richText'
                }
              ]
            },
          ]
        },
      ]
    },
  ]
}