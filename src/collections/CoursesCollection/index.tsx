import { CollectionConfig } from "payload";
import {
    BlocksFeature,
    FixedToolbarFeature,
    HeadingFeature,
    HorizontalRuleFeature,
    InlineToolbarFeature,
    lexicalEditor,
    UnorderedListFeature,
    OrderedListFeature,
} from '@payloadcms/richtext-lexical'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'


export const CoursesCollection: CollectionConfig = {
    slug: 'courses-collection',
    defaultSort: "-sortOrder",
    admin: {
        useAsTitle: 'title',

    },
    fields: [
        {
            name: 'sortOrder',
            type: 'number',
            admin: {
                position: 'sidebar',
                description: 'Higher numbers appear first'
            },
            defaultValue: 0
        },
        {
            name: 'title',
            type: 'text',
            required: true,
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
                        OrderedListFeature(),
                        UnorderedListFeature(),
                    ]
                },
            }),
            label: 'Content',
            required: true,
        },

        {
            name: 'contentPosition',
            type: 'select',
            options: [
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' }
            ],
            defaultValue: 'left'
        },
        {
            name: 'linkLabel',
            type: 'text',
            required: true,
        },
        {
            name: 'linkUrl',
            type: 'text',
            required: true,
        },
        {
            name: 'courseCard',
            type: 'relationship',
            relationTo: 'web-courses',
            hasMany: true,
            required: true,
        },

    ]
}