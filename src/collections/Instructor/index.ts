import { CollectionConfig } from 'payload';
import { richTextField } from '@/fields/richTextField';

export const Instructors: CollectionConfig = {
  slug: "instructors",
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "profileImage",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "expertise",
      type: "text",
      required: true,
    },
    {
      name: "experience",
      type: "number",
      required: true,
    },
    richTextField({ name: 'biography', required: true }),
  ]
}