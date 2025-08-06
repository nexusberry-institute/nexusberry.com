import { GlobalConfig } from "payload";
import {
    AlignFeature,
    FixedToolbarFeature,
    HeadingFeature,
    HorizontalRuleFeature,
    InlineToolbarFeature,
    lexicalEditor,
    UnorderedListFeature,
    IndentFeature,
    ChecklistFeature,
    BlockquoteFeature,
    UploadFeature,
} from "@payloadcms/richtext-lexical";

export const ImpactSection: GlobalConfig = {
    slug: 'impact-section',
    label: 'Impact Section',
    access: {
        read: () => true,
        update: () => true,
    },
    fields: [
        {
            name: 'heading',
            type: 'text',
            required: true,
            defaultValue: 'Our impact',
        },
        {
            name: 'subheading',
            type: 'textarea',
            required: false,
            defaultValue:
                'Over 5000 students and early career professionals have completed our courses. Our approach delivers demonstrable long-term impact for career success for future talent.',
        },
        {
            name: 'stats',
            type: 'array',
            fields: [
                {
                    name: 'value',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'description',
                    type: 'textarea',
                    required: true,
                },
            ],
        },

        {
            name: 'testimonials',
            type: 'array',
            fields: [

                {
                    name: 'content',
                    type: "richText",
                    editor: lexicalEditor({
                        features: ({ defaultFeatures, rootFeatures }) => {
                            return [
                                ...rootFeatures,
                                ...defaultFeatures,
                                HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                                FixedToolbarFeature(),
                                InlineToolbarFeature(),
                                UnorderedListFeature(),
                                HorizontalRuleFeature(),
                                AlignFeature(),
                                UploadFeature()
                            ]
                        },
                    }),
                },
                {
                    name: 'cardImage',
                    type: 'upload',
                    required: true,
                    relationTo: 'media',

                },
                {
                    name: 'name',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'university',
                    type: 'text',
                    required: false,
                },
            ],
        },
    ],
};
