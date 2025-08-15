// collections/ClassRecords.ts
import { CollectionConfig } from 'payload'

export const ClassRecords: CollectionConfig = {
    slug: 'class-records',
    admin: {
        group: "People Management",
        useAsTitle: 'employee',

    },
    fields: [

        {
            name: 'employee',
            type: 'relationship',
            relationTo: 'classes-employee',
            required: true,
        },
        {
            name: 'date',
            type: 'date',
            required: true,
        },
        {
            name: 'notes',
            type: 'textarea',
        },
    ],
}

export default ClassRecords
