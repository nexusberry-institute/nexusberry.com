import { slugField } from '@/fields/slug';
import { CollectionConfig } from 'payload';
import { revalidateEvents, revalidateDelete } from './hooks/revalidateEvents'
import {
  AlignFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical';

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'


export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
  },
  hooks: {
    afterChange: [revalidateEvents],
    afterDelete: [revalidateDelete],

  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Event Info",
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            ...slugField(),
            // {
            //   name: 'eventType',
            //   type: 'text',
            //   required: true,
            // },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'liveStreamLink',
              type: 'text',
              label: 'Live Stream Link',
              admin: {
                position: 'sidebar',
                description: 'Link to the live stream event',
              },
            },
            {
              name: 'startDateTime',
              label: 'Event Date & Time',
              type: 'date',
              required: true,
              hooks: {
                beforeChange: [
                  ({ data }) => {
                    if (data?.startDateTime && !data.endTime) {
                      data.endTime = new Date(new Date(data.startDateTime).getTime() + 1000 * 60 * 60 * 2)
                    }
                  }
                ]
              },
              admin: {
                position: 'sidebar',
                date: {
                  pickerAppearance: 'dayAndTime',
                  displayFormat: 'MMM dd, yyyy h:mm a', // Shows like "Jan 15, 2024 6:30 PM"
                },
                description: 'Select the date and starting time of the event'
              }
            },
            {
              name: 'endTime',
              label: 'Event End Time',
              type: 'date',
              defaultValue: undefined,
              hooks: {
                beforeChange: [
                  ({ data }) => {
                    if (data?.endTime && data.startDateTime) {
                      const startDate = new Date(data.startDateTime);
                      const year = startDate.getFullYear();
                      const month = startDate.getMonth();
                      const day = startDate.getDate();

                      // Get the time components from endTime
                      const endTimeDate = new Date(data.endTime);
                      const hours = endTimeDate.getHours();
                      const minutes = endTimeDate.getMinutes();
                      const seconds = endTimeDate.getSeconds();

                      // Create a new date with the date from startDateTime and time from endTime
                      const combinedEndDateTime = new Date(year, month, day, hours, minutes, seconds);

                      // If the end time is earlier than start time, assume it's for the next day
                      const startDateTime = new Date(data.startDateTime);
                      if (combinedEndDateTime < startDateTime) {
                        combinedEndDateTime.setDate(combinedEndDateTime.getDate() + 1);
                      }

                      // Update the endTime with the combined date-time
                      data.endTime = combinedEndDateTime;

                    }
                  }
                ]
              },
              admin: {
                position: 'sidebar',
                date: {
                  pickerAppearance: 'timeOnly',
                  displayFormat: 'h:mm a',
                },
                description: 'Select the end time of the event (optional). Default is 2 hours after the start time.'
              }
            },
            {
              name: "learningOutcomes",
              type: "richText",
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                    UnorderedListFeature(),
                    AlignFeature(),
                  ]
                },
              }),
            },
            {
              name: "instructor",
              type: "relationship",
              relationTo: "instructors",
            },
            {
              name: "department",
              type: "relationship",
              relationTo: "departments",
              admin: {
                position: "sidebar",
                allowCreate: false,
              }
            },
            {
              name: "whatsappLink",
              type: "text",
            },
            {
              name: "whatsappQrCode",
              type: "upload",
              relationTo: "media",
            },
          ]
        },
        {
          label: "SEO",
          fields: [
            {
              name: 'meta',
              label: 'SEO',
              type: "group",
              fields: [
                OverviewField({
                  titlePath: 'meta.title',
                  descriptionPath: 'meta.description',
                  imagePath: 'meta.image',
                }),
                MetaTitleField({
                  hasGenerateFn: true,
                }),
                MetaImageField({
                  relationTo: 'media',
                }),

                MetaDescriptionField({}),
                PreviewField({
                  // if the `generateUrl` function is configured
                  hasGenerateFn: true,

                  // field paths to match the target field for data
                  titlePath: 'meta.title',
                  descriptionPath: 'meta.description',
                }),
              ],
            },
          ]
        }
      ]
    }
  ],
};