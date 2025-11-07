// src/collections/Inquiries.ts
import { CollectionConfig } from 'payload';

export const Inquiries: CollectionConfig = {
    slug: 'inquiries',
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'email', 'contact', 'subject'],
        group: 'All Forms',
    },
    access: {
        read: () => true, // Optional: Allow public read
        create: () => true, // Allow public form submissions
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'email',
            type: 'email',
            required: true,
        },
        {
            name: 'contact',
            type: 'text',
            required: true,
        },
        {
            name: 'subject',
            type: 'select',
            options: [
                { label: 'General Inquiry', value: 'general' },
                { label: 'Technical Support', value: 'support' },
                { label: 'Sales Question', value: 'sales' },
                { label: 'Partnership', value: 'partnership' },
                { label: 'Feedback', value: 'feedback' },
                { label: 'Other', value: 'other' },
            ],
            required: true,
        },
        {
            name: 'query',
            type: 'textarea',
            required: true,
        },
    ],
};

export default Inquiries;
