import { CollectionConfig } from 'payload'
import { richTextField } from '@/fields/richTextField'
import { revalidateQuizQuestion, revalidateDeleteQuizQuestion } from './hooks/revalidateQuizQuestion'

export const QuizQuestions: CollectionConfig = {
  slug: 'quiz-questions',
  admin: {
    group: "Classwork",
  },
  hooks: {
    afterChange: [revalidateQuizQuestion],
    afterDelete: [revalidateDeleteQuizQuestion],
  },
  fields: [
    richTextField({ name: 'text', required: true }),
    {
      name: 'options',
      type: "array",
      required: true,
      maxRows: 4,
      fields: [
        {
          name: 'option',
          type: 'text'
        }
      ],
      admin: {
        isSortable: false
      }
    },
    {
      name: 'correctAnswer',
      type: "number",
      required: true,
      min: 0,
      admin: {
        description: "Zero-based index of the correct option (e.g., 0 for first, 1 for second)"
      },
      validate: (value: number | null | undefined, { siblingData }: { siblingData: Record<string, unknown> }) => {
        if (value === null || value === undefined) return 'Correct answer is required'
        if (value < 0) return 'Must be 0 or greater'
        const optionsLength = (siblingData?.options as unknown[])?.length ?? 0
        if (optionsLength > 0 && value >= optionsLength) {
          return `Must be less than ${optionsLength} (you have ${optionsLength} option${optionsLength === 1 ? '' : 's'})`
        }
        return true
      },
    },
    richTextField({ name: 'explanation' }),
    {
      name: 'tags',
      type: "text",
      hasMany: true,
      admin: {
        position: 'sidebar'
      }
    },
  ],
}


// {
//   name: 'type',
//   type: 'select',
//   options: [
//     'MCQ',
//     'SHORT_ANSWER',
//     'MIX'
//   ],
//   defaultValue: 'MCQ'
// },