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
    //  
    // type: MCQ, SHORT_ANSWER, MIX
    // tags: text many (difficulty level, length, techStack: programming language, framework)
    // relation with module, module topics, lecture
    // publish draft system
    {
      name: "modules",
      type: "relationship",
      relationTo: "modules",
    },
  ],
}

export default Quizzes;
