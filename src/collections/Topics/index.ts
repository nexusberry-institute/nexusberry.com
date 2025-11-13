import { CollectionConfig } from 'payload'

export const Topics: CollectionConfig = {
  slug: 'topics',
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

export default Topics


