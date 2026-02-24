import { CollectionConfig } from 'payload'
import { slugField } from '@/fields/slug'
import { richTextField } from '@/fields/richTextField'
import { revalidateQuiz, revalidateDeleteQuiz } from './hooks/revalidateQuiz'

export const Quizzes: CollectionConfig = {
  slug: 'quizzes',
  admin: {
    group: "Classwork",
    useAsTitle: 'title'
  },
  hooks: {
    afterChange: [revalidateQuiz],
    afterDelete: [revalidateDeleteQuiz],
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
    richTextField({ name: 'instructions', label: 'Instructions' }),
    // Sidebar fields
    ...slugField(),
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: {
        position: 'sidebar',
      }
    },
  ]
}

// type: MCQ, SHORT_ANSWER, MIX
