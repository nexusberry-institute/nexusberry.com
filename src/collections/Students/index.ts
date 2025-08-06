// import { checkAccess } from '@/access/accessControl';
import { CollectionConfig } from "payload";
import { checkAndCreateUser } from '@/hooks/checkAndCreateUser';

export const Students: CollectionConfig = {
  slug: "students",
  admin: {
    group: "People Management",
    defaultColumns: ['user', 'fullName', 'phoneNumber'],
    useAsTitle: 'fullName',
    listSearchableFields: ['fullName', 'phoneNumber', "user.email"],
  },
  access: {
    // create: checkAccess('students', 'create'),
    // read: checkAccess('students', 'read'),
    // update: checkAccess('students', 'update'),
    // delete: checkAccess('students', 'delete'),
  },
  hooks: {
    beforeChange: [checkAndCreateUser]
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Student Information",
          fields: [
            {
              name: 'user',
              type: 'relationship',
              relationTo: 'users',
              hasMany: false,
              unique: true,
              access: {
                create: () => false
              }
            },
            {
              type: "row",
              fields: [
                {
                  name: "studentEmail",
                  type: "email",
                  virtual: true,
                  validate: (value, { data }) => {
                    if (value) {
                      return true
                    }
                    return "Please Enter Student Email"
                  },
                  admin: {
                    condition: (data) => {
                      if (data.user) {
                        return false
                      }
                      return true
                    }
                  }
                },
                {
                  name: "studentPassword",
                  type: "text",
                  virtual: true,
                  validate: (value: any, { data }: any) => {
                    if (value) {
                      return true
                    }
                    if (data?.user) {
                      return true
                    }
                    return "Please Enter Student Password"
                  },
                  admin: {
                    condition: (data) => {
                      if (data.user) {
                        return false
                      }
                      return true
                    }
                  }
                },
              ]
            },
            {
              name: 'fullName',
              type: 'text',
              minLength: 3
            },
            {
              name: 'phoneNumber',
              type: 'text',
            },
            {
              name: "gmail_username",
              type: "text",
            },
            {
              name: 'dateOfBirth',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayOnly',
                  displayFormat: 'dd/MM/yyyy',
                },
              },
            },
            {
              name: 'gender',
              type: 'select',
              options: [
                {
                  label: 'Male',
                  value: 'male',
                },
                {
                  label: 'Female',
                  value: 'female',
                }
              ]
            },
            {
              name: 'education',
              type: 'text',
              admin: {
                description: "Highest Student Education"
              }
            },
            {
              name: "otp",
              type: "text",
              admin: {
                readOnly: true,
              },
            },
            {
              name: "otpVerified",
              type: "checkbox",
            },
            {
              name: "otpGeneratedAt",
              type: "date",
              admin: {
                readOnly: true,
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'address',
              type: 'group',
              fields: [
                {
                  name: 'homeAddress',
                  type: 'text',
                },
                {
                  name: 'city',
                  type: 'text',
                },
                {
                  name: 'state',
                  type: 'text',
                },
                {
                  name: 'country',
                  type: 'text',
                },
              ],
            },
            {
              name: 'profilePicture',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          label: "Student Enrollments",
          fields: [
            {
              name: "studentEnrollments",
              type: "join",
              collection: "enrollments",
              on: "student",
            }
          ]
        }
      ]
    }
  ]
};

