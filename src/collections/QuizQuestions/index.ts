import { CollectionConfig } from 'payload'

export const QuizQuestions: CollectionConfig = {
  slug: 'quiz-questions',
  admin: {
    group: "Classwork",
    // useAsTitle: 'title',
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
      hasMany: true
    },
    // relation with module, topic, lecture, lectureTopic
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
    },

  ],
}

export default QuizQuestions;

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