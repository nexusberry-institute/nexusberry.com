import { CollectionConfig } from 'payload'

export const QuizQuestions: CollectionConfig = {
  slug: 'quiz-questions',
  admin: {
    group: "Classwork",
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'text',
      type: "text",
      required: true
    },

    // options: array of text
    // type: MCQ, SHORT_ANSWER, default MCQ
    // tags: text many

    // correctAnswer: array index as number 
    {
      name: 'correctAnswer',
      type: "text",
      required: true
    },
    // relation with module, topic, lecture, lectureTopic
    {
      name: "modules",
      type: "relationship",
      relationTo: "modules",
    },
  ],
}

export default QuizQuestions;