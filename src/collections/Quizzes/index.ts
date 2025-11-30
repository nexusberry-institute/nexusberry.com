import { CollectionConfig } from 'payload'

export const Quizzes: CollectionConfig = {
  slug: 'quizzes',
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
    // questions relation to quizQuestions
    // techStack: text many programming language, framework, 
    // type: MCQ, theory, mix
    // tags: text many (difficulty level, length)
    // relation with module, module topics, lecture, lectureTopic
    {
      name: "modules",
      type: "relationship",
      relationTo: "modules",
    },
  ],
}

export default Quizzes;
