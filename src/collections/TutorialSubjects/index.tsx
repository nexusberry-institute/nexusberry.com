import type { CollectionConfig } from "payload";

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
      type: 'text'
    }
  ]

}