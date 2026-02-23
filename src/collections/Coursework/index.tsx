import { CollectionConfig } from "payload";
import { slugField } from "@/fields/slug";
import { richTextField } from "@/fields/richTextField";

// department, course, module (required), topicGroup, topic(required), parts
export const Coursework: CollectionConfig = {
  slug: "coursework",
  admin: {
    useAsTitle: "topic",
    group: "Classwork",
    defaultColumns: ['id', 'slug', 'module', 'topic', 'topicGroup', 'parts', 'createdAt'],
  },
  fields: [
    ...slugField('topic'),
    {
      name: "module",
      type: "relationship",
      relationTo: "modules",
      required: true,
      hasMany: false,
    },
    {
      name: "topicGroup",
      type: "text",
      admin: {
        position: 'sidebar',
      }
    },
    {
      name: "topic",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: 'parts',
      type: 'relationship',
      relationTo: 'coursework',
      admin: {
        position: 'sidebar',
      }
    },
    richTextField({ label: 'Content', required: true }),
  ]
}