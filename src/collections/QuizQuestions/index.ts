import { CollectionConfig } from 'payload'

export const QuizQuestions: CollectionConfig = {
  slug: 'quiz-questions',
  admin: {
    group: "Classwork",
  },
  fields: [
    {
      name: 'text',
      type: "textarea",
      required: true
    },
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
      type: "number", // index in options
      required: true
    },
    {
      name: 'explanation',
      type: "textarea",
    },
    {
      name: 'tags',
      type: "text",
      hasMany: true,
      admin: {
        position: 'sidebar'
      }
    },
    {
      name: "module",
      type: "relationship",
      relationTo: "modules",
      admin: {
        position: 'sidebar'
      }
    },
    {
      name: "moduleTopic",
      type: "relationship",
      relationTo: "module-topics",
      admin: {
        position: 'sidebar'
      }
    },
    {
      name: "lecture",
      type: "relationship",
      relationTo: "lectures",
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