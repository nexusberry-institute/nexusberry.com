import type { CollectionConfig } from "payload";
import { slugField } from '@/fields/slug'

export const TutorialSubjects: CollectionConfig = {
  slug: 'tutorial-subjects',
  admin: {
    useAsTitle: 'title',
    description: 'Subjects Categories for Tutorials',
    group: "Classwork",
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true
    },
    ...slugField(),
    {
      name: 'position',
      type: "number",
      admin: {
        position: 'sidebar',
      },
    },
  ]

}