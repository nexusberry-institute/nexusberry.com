import type { CollectionConfig } from "payload";

export const Tutorials: CollectionConfig = {
  slug: 'tutorials',
  admin: {
    useAsTitle: 'title',
    description: 'Tutorials of All Subjects',
    group: "Classwork",
  },
  fields: [
    {
      name: 'title',
      type: 'text'
    },
    {
      name: 'subject',
      type: "relationship",
      relationTo: 'tutorial-subjects',
      admin: {
        position: 'sidebar',
      },
    }
    // video
  ]

}