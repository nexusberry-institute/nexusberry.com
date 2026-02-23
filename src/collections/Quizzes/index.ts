import { CollectionConfig } from 'payload'
import { slugField } from '@/fields/slug'

export const Quizzes: CollectionConfig = {
  slug: 'quizzes',
  admin: {
    group: "Classwork",
    useAsTitle: 'title'
  },
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
      name: 'questions',
      type: 'relationship',
      relationTo: 'quiz-questions',
      hasMany: true
    },
    // Sidebar fields
    {
      name: 'visible',
      type: 'checkbox',
      defaultValue: false,
      label: 'Visible on Frontend',
      admin: {
        position: 'sidebar',
        description: 'When enabled, this quiz will be displayed on the frontend.',
      }
    },
    {
      name: 'status',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      }
    },
    ...slugField(),
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: {
        position: 'sidebar',
      }
    },
    {
      name: "module",
      type: "relationship",
      relationTo: "modules",
      admin: {
        position: 'sidebar',
      }
    },
    {
      name: "moduleTopic",
      type: "relationship",
      relationTo: "module-topics",
      admin: {
        position: 'sidebar',
      }
    },
    {
      name: "lecture",
      type: "relationship",
      relationTo: "lectures",
      admin: {
        position: 'sidebar',
      }
    },
  ]
}

// type: MCQ, SHORT_ANSWER, MIX
