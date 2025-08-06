import { CollectionConfig } from "payload";
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { slugField } from "@/fields/slug";

// department, course, module (required), topicGroup, topic(required), parts
export const Coursework: CollectionConfig = {
  slug: "coursework",
  admin: {
    useAsTitle: "topic",
    group: "Course Work",
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
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
          ]
        },
      }),
      label: 'Content',
      required: true,
    },
  ]
}