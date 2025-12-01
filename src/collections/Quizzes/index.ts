import { CollectionConfig } from 'payload'

export const Quizzes: CollectionConfig = {
  slug: 'quizzes',
  admin: {
    group: "Classwork",
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
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
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
              name: 'thumbnail',
              type: 'upload',
              relationTo: 'media'
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
              type: 'relationship',
              relationTo: 'quiz-questions',
              hasMany: true
            },
          ]
        },
      ]
    },
  ]
}

// type: MCQ, SHORT_ANSWER, MIX