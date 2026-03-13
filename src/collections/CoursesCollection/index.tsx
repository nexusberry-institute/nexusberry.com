import { CollectionConfig } from "payload";
import { richTextField } from "@/fields/richTextField";
import { revalidateCoursesCollection, revalidateCoursesCollectionDelete } from "./hooks/revalidateCoursesCollection";


export const CoursesCollection: CollectionConfig = {
    slug: 'courses-collection',
    defaultSort: "-sortOrder",
    admin: {
        useAsTitle: 'title',

    },
    hooks: {
        afterChange: [revalidateCoursesCollection],
        afterDelete: [revalidateCoursesCollectionDelete],
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

        richTextField({ label: 'Content', required: true }),

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