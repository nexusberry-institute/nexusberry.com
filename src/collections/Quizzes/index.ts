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
    {
      name: "modules",
      type: "relationship",
      relationTo: "modules",
    },
  ],
}

export default Quizzes;
