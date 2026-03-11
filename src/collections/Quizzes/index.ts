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
    {
      name: 'saveMarks',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'When enabled, users must sign in with Google and their score will be saved.',
      },
    },
    {
      name: 'allowRetake',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Allow users to retake the quiz. Latest attempt is stored. Only applies when Save Marks is on.',
        condition: (data) => data.saveMarks === true,
      },
    },
    {
      name: 'timePerQuestion',
      type: 'number',
      defaultValue: 30,
      min: 10,
      max: 600,
      admin: {
        position: 'sidebar',
        description: 'Seconds allowed per question (default: 30).',
      },
    },
    {
      name: 'attempts',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Total times this quiz has been completed.',
        readOnly: true,
      },
    },
  ]
}

// type: MCQ, SHORT_ANSWER, MIX
