import type { CollectionConfig } from 'payload'

export const PlatformRedirects: CollectionConfig = {
    slug: 'platform-redirects',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'platform', 'slug', 'clicks', 'targetUrl'],
        // components: {
        //     BeforeList: [PlatformRedirectsAnalytics],
        // }
    },
    access: {
        read: () => true,
        create: ({ req: { user } }) => Boolean(user),
        update: ({ req: { user } }) => Boolean(user),
        delete: ({ req: { user } }) => Boolean(user),
    },
    fields: [
        // Basic Info
        {
            name: 'title',
            type: 'text',
            required: true,
            label: 'Redirect Title',
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            index: true,
            label: 'Short URL Slug',
            admin: {
                description:
                    'Example: "python-demo" will create https://nexusberry.com/go/python-demo',
            },
        },
        {
            name: 'platform',
            type: 'select',
            required: true,
            defaultValue: 'youtube',
            options: [
                { label: 'YouTube', value: 'youtube' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'Facebook', value: 'facebook' },
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'Website', value: 'website' },
                { label: 'Other', value: 'other' },
            ],
            admin: {
                description: 'Select the destination platform for this redirect.',
            },
        },
        {
            name: 'targetUrl',
            type: 'text',
            required: true,
            label: 'Target URL',
            admin: {
                description: 'Paste the exact destination URL here.',
            },
        },

        // UTM Tracking
        {
            type: 'collapsible',
            label: 'UTM Tracking (Optional)',
            fields: [
                { name: 'utm_source', type: 'text', admin: { placeholder: 'facebook, whatsapp, etc.' } },
                { name: 'utm_medium', type: 'text', admin: { placeholder: 'social, cpc, organic' } },
                { name: 'utm_campaign', type: 'text', admin: { placeholder: 'october_launch, ai_course' } },
            ],
        },

        // Auto Click Count
        {
            name: 'clicks',
            type: 'number',
            label: 'Total Clicks',
            defaultValue: 0,
            admin: {
                description: 'Automatically counts each time this redirect is visited.',
            },
        },

        // Notes
        {
            name: 'description',
            type: 'textarea',
            label: 'Description / Notes',
        },
    ],

    hooks: {
        // Optional: Prevent manual click edits by non-admins
        beforeChange: [
            ({ data, originalDoc, operation, req }) => {
                if (operation === 'update' && !req.user?.roles?.includes('admin')) {
                    // Prevent direct manual changes to clicks
                    if (data.clicks !== originalDoc.clicks) {
                        data.clicks = originalDoc.clicks;
                    }
                }
                return data;
            },
        ],
    },
};

export default PlatformRedirects;
