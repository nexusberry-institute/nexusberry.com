import { CollectionConfig } from "payload";

export const ContactMessages: CollectionConfig = {
    slug: "contact-messages",
    admin: {
        useAsTitle: "username", // Display the name in the admin list
        defaultColumns: ["username", "email", "phone", "occupation", "createdAt"],
    },
    access: {
        read: () => true, // Public can read (adjust as needed)
        create: () => true, // Allow anyone to create
        update: () => false, // No one should edit submissions
        delete: () => false, // No one should delete submissions
    },
    fields: [
        {
            name: "username",
            type: "text",
            label: "Name",
            required: true,
        },
        {
            name: "phone",
            type: "text",
            label: "Phone Number",
            required: true,
        },
        {
            name: "email",
            type: "email",
            label: "Email Address",
            required: true,
        },
        {
            name: "occupation",
            type: "text",
            label: "Occupation",
        },
        {
            name: "message",
            type: "textarea",
            label: "Message",
            required: true,
        },
    ],
};
