// collections/Employees.ts
import { CollectionConfig } from 'payload'

export const Employees: CollectionConfig = {
    slug: 'classes-employee',
    admin: {
        group: "People Management",
        useAsTitle: 'name',
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'perClassRate',
            type: 'number',
            required: true,
            defaultValue: 2000, // default rate
        },
    ],
}

export default Employees
