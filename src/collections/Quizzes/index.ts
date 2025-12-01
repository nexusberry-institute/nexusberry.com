import { draftMode } from 'next/headers';
import { CollectionConfig } from 'payload'

export const Quizzes: CollectionConfig = {
  slug: 'quizzes',
  admin: {
    group: "Classwork",
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar'
      }
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    // questions relation to quizQuestions
    {
      name: 'questions',
      type: 'relationship',
      relationTo: 'quiz-questions',
      hasMany: true
    },
    // tags: text many (difficulty level, length, techStack: programming language, framework)
    // relation with module, module topics, lecture
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
    // publish draft system
  ],
  versions: {
    drafts: true
  },
}

export default Quizzes;

// type: MCQ, SHORT_ANSWER, MIX