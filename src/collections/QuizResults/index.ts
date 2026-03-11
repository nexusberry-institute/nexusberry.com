import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/checkRole'

export const QuizResults: CollectionConfig = {
  slug: 'quiz-results',
  admin: {
    group: 'Classwork',
    useAsTitle: 'id',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'quiz',
      type: 'relationship',
      relationTo: 'quizzes',
      required: true,
      index: true,
    },
    {
      name: 'score',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'totalQuestions',
      type: 'number',
      required: true,
      min: 1,
    },
    {
      name: 'attempts',
      type: 'number',
      defaultValue: 1,
      min: 1,
      admin: {
        description: 'How many times this user has completed this quiz',
        readOnly: true,
      },
    },
    {
      name: 'completedAt',
      type: 'date',
      required: true,
    },
  ],
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (checkRole(['admin', 'superadmin'], user)) return true
      return { user: { equals: user.id } }
    },
    create: () => false,
    update: () => false,
    delete: ({ req: { user } }) => {
      if (!user) return false
      return checkRole(['admin', 'superadmin'], user)
    },
  },
}
