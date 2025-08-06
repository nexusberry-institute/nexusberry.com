import { GlobalConfig } from "payload";

export const Settings: GlobalConfig = {
    slug: "settings",
    label: "Site Settings",
    fields: [
        {
            name: "whatsappPhoneNumber",
            type: "text",
            required: false,
            admin: {
                description: "WhatsApp phone number without + or spaces",
            },
        },
        {
            name: "whatsappDefaultMessage",
            type: "textarea",
            required: false,
        },
        {
            name: "enableWhatsappButton",
            type: "checkbox",
            required: false,
            defaultValue: true,
        },

        // Contact Details Section
        {
            name: "contactEmail",
            type: "email",
            required: false,
            label: "Contact Email",
            admin: {
                description: "Primary contact email for the website",
            },
        },

        {
            name: "address",
            type: "textarea",
            required: false,
            label: "Business Address",
            admin: {
                description: "Complete business address",
            },
        },

        {
            name: "mapLocation",
            type: "group",
            label: "Map Location",
            fields: [
                {
                    name: "latitude",
                    type: "number",
                    required: false,
                    admin: {
                        description: "Latitude coordinate for map pin",
                    },
                },
                {
                    name: "longitude",
                    type: "number",
                    required: false,
                    admin: {
                        description: "Longitude coordinate for map pin",
                    },
                },
                {
                    name: "googleMapsUrl",
                    type: "text",
                    required: false,
                    admin: {
                        description: "Direct Google Maps URL (optional)",
                    },
                },
            ],
        },

    ],
};

// Contact Details
// social links
// export const nexusberryFbPageLink = Linlhttps://www.facebook.com/nexusberry
// https://www.instagram.com/nexusberry.trainings
// https://www.youtube.com/@nexusberry.trainings
// https://www.linkedin.com/company/nexusberry

// emails

// address

// map pin location

