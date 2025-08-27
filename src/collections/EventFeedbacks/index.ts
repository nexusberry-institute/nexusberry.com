import { CollectionConfig } from 'payload';

export const EventFeedbacks: CollectionConfig = {
  slug: "event-feedbacks",
  fields: [
    {
      name: "lead",
      type: "relationship",
      label: "Registered Attendee",
      relationTo: "leads",
      hasMany: false,
      required: true,
    },
    {
      name: "event",
      label: "Attended Event",
      type: "relationship",
      required: true,
      relationTo: "events",
      hasMany: false,
    },
    {
      name: "rating",
      type: "number",
      required: true,
      max: 5
    },
    {
      label: "Attendance Reason",
      name: "reason",
      type: "radio",
      options: [
        {
          label: "Topic Interest",
          value: "topic-interest"
        },
        {
          label: "Mentor preference",
          value: "mentor-preference"
        },
        {
          label: "Mentorship program interest",
          value: "mentorship-program-interest"
        },
        {
          label: "Field specific interest",
          value: "field-specific-interest"
        },
        {
          label: "others",
          value: "others"
        }
      ]
    },
    {
      name: "otherReason",
      type: "text"

    },
    {
      label: "Mentorship Interest",
      name: "mentorship",
      type: "radio",
      options: [
        {
          label: "Yes",
          value: "yes"
        },
        {
          label: "No",
          value: "no"
        }
      ]
    },


  ]
}