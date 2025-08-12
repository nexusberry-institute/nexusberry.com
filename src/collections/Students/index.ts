// import { checkAccess } from '@/access/accessControl';
import { CollectionConfig, PayloadRequest, CustomComponent } from 'payload'
import { checkAndCreateUser } from '@/hooks/checkAndCreateUser'
import { CSVExportButton } from '@/components/CSVExportButton'
import type { NextApiRequest, NextApiResponse } from 'next'
export const Students: CollectionConfig = {
  slug: "students",
  admin: {
    group: "People Management",
    defaultColumns: ['user', 'fullName', 'phoneNumber'],
    useAsTitle: 'fullName',
    listSearchableFields: ['fullName', 'phoneNumber', "user.email"],
    components: {
      beforeList: [CSVExportButton as any],
    }
  },
  hooks: {
    beforeChange: [checkAndCreateUser]
  },

  access: {
    // create: checkAccess('students', 'create'),
    // read: checkAccess('students', 'read'),
    // update: checkAccess('students', 'update'),
    // delete: checkAccess('students', 'delete'),
  },

  endpoints: [
    {
      path: '/export-csv',
      method: 'get',
      handler: async (req) => {
        try {
          const payloadInstance = req.payload
          if (!payloadInstance) {
            return new Response(JSON.stringify({ error: 'Payload instance not available' }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            })
          }

          const result = await payloadInstance.find({
            collection: 'students',
            limit: 0,
            depth: 0,
          })

          let csvContent: string
          if (!result.docs?.length) {
            csvContent = '"Full Name"\n'
          } else {
            const csvRows = ['"Full Name"']
            for (const student of result.docs) {
              if (student.fullName) {
                csvRows.push(`"${student.fullName.replace(/"/g, '""')}"`)
              }
            }
            csvContent = csvRows.join('\n')
          }

          return new Response(csvContent, {
            status: 200,
            headers: {
              'Content-Type': 'text/csv; charset=utf-8',
              'Content-Disposition': 'attachment; filename="students_names.csv"',
            }
          })
        } catch (error: any) {
          console.error('CSV export error:', error)
          return new Response(JSON.stringify({ error: 'Export failed', message: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          })
        }
      }
    }


    // endpoints: [
    //   async function handler(req: NextApiRequest, res: NextApiResponse) {
    //     // Only allow GET requests
    //     if (req.method !== "GET") {
    //       console.log("Method not allowed:", req.method)
    //       return res.status(405).json({ error: "Method not allowed" })
    //     }

    //     try {
    //       console.log("=== CSV Export Debug Info ===")
    //       console.log("Request method:", req.method)
    //       console.log("Request URL:", req.url)
    //       console.log("Environment:", process.env.NODE_ENV)
    //       console.log("Has req.payload:", !!req.payload)

    //       // Log all available properties on req to see what we have
    //       console.log("Request properties:", Object.keys(req))

    //       console.log("CSV Export: Starting export process...")

    //       // Option 1: Try to use req.payload if available
    //       let payloadInstance = req.payload

    //       // Option 2: If req.payload is not available, try to get payload directly
    //       if (!payloadInstance) {
    //         console.log("req.payload not available, trying to get payload directly...")

    //         // You'll need to adjust this based on your payload setup
    //         try {
    //           // Method 1: Try importing payload directly
    //           const payload = require('payload')
    //           if (payload.db) {
    //             payloadInstance = payload
    //             console.log("Got payload from direct import")
    //           }
    //         } catch (importError) {
    //           console.log("Could not import payload directly:", importError.message)
    //         }

    //         // Method 2: Try to initialize payload if not already initialized
    //         if (!payloadInstance) {
    //           try {
    //             const payload = require('payload')

    //             if (!payload.initialized) {
    //               console.log("Initializing payload...")
    //               await payload.init({
    //                 secret: process.env.PAYLOAD_SECRET,
    //                 mongoURL: process.env.DATABASE_URI || process.env.MONGO_URL,
    //                 local: true,
    //               })
    //             }

    //             payloadInstance = payload
    //             console.log("Payload initialized successfully")
    //           } catch (initError) {
    //             console.error("Failed to initialize payload:", initError)
    //           }
    //         }
    //       }

    //       if (!payloadInstance) {
    //         console.error("Could not get payload instance")
    //         return res.status(500).json({
    //           error: "Server configuration error",
    //           message: "Could not access payload instance",
    //           debug: {
    //             hasReqPayload: !!req.payload,
    //             nodeEnv: process.env.NODE_ENV,
    //             hasPayloadSecret: !!process.env.PAYLOAD_SECRET,
    //             hasDatabaseUri: !!(process.env.DATABASE_URI || process.env.MONGO_URL),
    //           }
    //         })
    //       }

    //       console.log("CSV Export: Fetching students...")

    //       // Get all students with error handling
    //       const result = await payloadInstance.find({
    //         collection: "students",
    //         limit: 0, // Get all records
    //         depth: 0, // No need for deep relationships
    //         where: {}, // Explicit empty where clause
    //       })

    //       console.log(`CSV Export: Found ${result.docs?.length || 0} students`)

    //       if (!result.docs || result.docs.length === 0) {
    //         console.log("CSV Export: No students found, returning empty CSV")
    //         const emptyCSV = '"Full Name"\n'
    //         res.setHeader("Content-Type", "text/csv; charset=utf-8")
    //         res.setHeader("Content-Disposition", 'attachment; filename="students_names.csv"')
    //         return res.send(emptyCSV)
    //       }

    //       // Process names with better error handling
    //       const names: string[] = []
    //       let processedCount = 0
    //       let skippedCount = 0

    //       result.docs.forEach((student: any, index: number) => {
    //         try {
    //           if (student.fullName && typeof student.fullName === "string" && student.fullName.trim()) {
    //             // Properly escape CSV values
    //             const escapedName = `"${student.fullName.replace(/"/g, '""')}"`
    //             names.push(escapedName)
    //             processedCount++
    //             console.log(`Processing: ${student.fullName}`)
    //           } else {
    //             console.log(`CSV Export: Skipping student ${student.id || index} - no valid fullName (value: ${student.fullName})`)
    //             skippedCount++
    //           }
    //         } catch (nameError) {
    //           console.error(`CSV Export: Error processing student ${student.id || index}:`, nameError)
    //           skippedCount++
    //         }
    //       })

    //       console.log(`CSV Export: Processed ${processedCount} names, skipped ${skippedCount}`)

    //       // Create CSV content
    //       const csvHeader = '"Full Name"'
    //       const csvContent = [csvHeader, ...names].join("\n")

    //       console.log(`CSV Export: Generated CSV content:`)
    //       console.log(csvContent)
    //       console.log(`CSV Export: Generated CSV with ${csvContent.split("\n").length} lines`)

    //       // Set proper headers
    //       res.setHeader("Content-Type", "text/csv; charset=utf-8")
    //       res.setHeader("Content-Disposition", 'attachment; filename="students_names.csv"')
    //       res.setHeader("Content-Length", Buffer.byteLength(csvContent, "utf8"))

    //       console.log("CSV Export: Sending CSV response...")
    //       return res.send(csvContent)

    //     } catch (error: any) {
    //       console.error("=== CSV Export Error - Full Details ===")
    //       console.error("Error object:", error)
    //       console.error("Error message:", error.message)
    //       console.error("Error stack:", error.stack)
    //       console.error("Error name:", error.name)

    //       // Log additional context
    //       console.error("Context:", {
    //         hasPayload: !!req.payload,
    //         method: req.method,
    //         url: req.url,
    //         timestamp: new Date().toISOString(),
    //         nodeEnv: process.env.NODE_ENV,
    //       })

    //       // Return detailed error for debugging
    //       return res.status(500).json({
    //         error: "Export failed",
    //         message: error.message || "Unknown error occurred",
    //         details: {
    //           stack: error.stack,
    //           name: error.name,
    //           hasReqPayload: !!req.payload,
    //           timestamp: new Date().toISOString(),
    //           nodeEnv: process.env.NODE_ENV,
    //           errorType: typeof error,
    //           errorConstructor: error.constructor?.name,
    //         },
    //       })
    //     }
    //   }

    // {
    //   path: '/students/export-names',
    //   method: 'get',
    //   handler: async (req, res) => {
    //     try {
    //       // 1. Get all students
    //       const result = await req.payload.find({
    //         collection: 'students',
    //         limit: 0, // Get all records
    //         depth: 0  // No need for deep relationships
    //       });

    //       // 2. Process names - handle null/undefined cases
    //       const names = result.docs.map(student => {
    //         // Handle cases where fullName might be null/undefined
    //         return student.fullName ? `"${student.fullName.replace(/"/g, '""')}"` : '';
    //       }).filter(name => name !== ''); // Remove empty entries

    //       // 3. Create CSV content with proper escaping
    //       const csvContent = ['"Full Name"', ...names].join('\n');

    //       // 4. Send response
    //       res.setHeader('Content-Type', 'text/csv');
    //       res.setHeader('Content-Disposition', 'attachment; filename=students_names.csv');
    //       return res.send(csvContent);

    //     } catch (error) {
    //       console.error("CSV Export Error:", {
    //         message: error.message,
    //         stack: error.stack,
    //         timestamp: new Date().toISOString()
    //       });
    //       return res.status(500).json({
    //         error: 'Export failed',
    //         details: process.env.NODE_ENV === 'development' ? error.message : undefined
    //       });
    //     }
    //   }
    // }

    // {
    //   path: '/export-names',
    //   method: 'get',
    //   handler: async (req, res) => {
    //     try {
    //       console.log("Starting export-names endpoint");

    //       const students = await req.payload.find({
    //         collection: 'students',
    //         limit: 0,
    //         populate: ['user'],
    //         depth: 1 // Add depth to ensure proper population
    //       });

    //       console.log(`Found ${students.totalDocs} students`);

    //       if (!students.docs || students.docs.length === 0) {
    //         console.log("No students found");
    //         return res.status(200).send("Full Name\n"); // Empty CSV with header
    //       }

    //       const names = students.docs.map(student => {
    //         if (!student.fullName) {
    //           console.warn(`Student with ID ${student.id} has no fullName`);
    //         }
    //         return student.fullName || '';
    //       }).filter(name => name.trim() !== '');

    //       console.log(`Exporting ${names.length} names`);

    //       const csvContent = ['Full Name', ...names].join('\n');

    //       res.setHeader('Content-Type', 'text/csv');
    //       res.setHeader('Content-Disposition', 'attachment; filename=students_names.csv');
    //       res.send(csvContent);

    //     } catch (error) {
    //       console.error("Detailed export error:", {
    //         message: error.message,
    //         stack: error.stack,
    //         rawError: error
    //       });
    //       res.status(500).json({
    //         error: 'Failed to export',
    //         details: error.message,
    //         stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    //       });
    //     }
    //   }
    // },

    // {
    //   path: '/students/export-names',
    //   method: 'get',
    //   handler: async (req, res) => {
    //     try {
    //       console.log("Export names endpoint hit");

    //       const students = await req.payload.find({
    //         collection: 'students',

    //         populate: { user: true },
    //         limit: 0
    //       });

    //       console.log("Found students:", students.totalDocs);

    //       const names = students.docs
    //         .map(s => s.user?.fullName)
    //         .filter(Boolean)
    //         .join('\n');

    //       res.setHeader('Content-Type', 'text/csv');
    //       res.setHeader('Content-Disposition', 'attachment; filename=active_students_names.csv');
    //       res.send(`Full Name\n${names.split('\n').map(n => `"${n}"`).join('\n')}`);


    //       // CSV headers and content
    //       res.setHeader('Content-Type', 'text/csv');
    //       res.setHeader(
    //         'Content-Disposition',
    //         'attachment; filename=active_students_names.csv'
    //       );
    //       res.send(`Full Name\n${names.split('\n').map(n => `"${n}"`).join('\n')}`);

    //     } catch (error) {
    //       console.error("Export names error:", error);
    //       res.status(500).json({ error: error.message || 'Failed to export' });
    //     }
    //   }
    // },
    // {
    //   path: '/students/export-mobiles',
    //   method: 'get',
    //   handler: async (req, res) => {
    //     try {
    //       console.log("Export mobiles endpoint hit");

    //       const students = await req.payload.find({
    //         collection: 'students',
    //         where: {
    //           and: [
    //             { user: { exists: true } },
    //             { otpVerified: { equals: true } }
    //           ]
    //         },
    //         populate: { user: true },
    //         limit: 0
    //       });

    //       console.log("Found students:", students.totalDocs);

    //       const mobiles = students.docs
    //         .map(s => s.user?.mobile)
    //         .filter(Boolean)
    //         .join('\n');

    //       res.setHeader('Content-Type', 'text/csv');
    //       res.setHeader('Content-Disposition', 'attachment; filename=active_students_mobiles.csv');
    //       res.send(`Mobile\n${mobiles.split('\n').map(m => `"${m}"`).join('\n')}`);

    //     } catch (error) {
    //       console.error("Export mobiles error:", error);
    //       res.status(500).json({ error: error.message || 'Failed to export' });
    //     }
    //   }
    // },


    // {
    //   path: '/export-mobiles',
    //   method: 'get',
    //   handler: async (req, res, next) => {
    //     try {
    //       const { payload } = req;

    //       // Get all active students
    //       const students = await payload.find({
    //         collection: 'students',
    //         where: {
    //           and: [
    //             { user: { exists: true } },
    //             { otpVerified: { equals: true } }, // Assuming verified students are active
    //             { phoneNumber: { exists: true } }
    //           ]
    //         },
    //         limit: 0 // Get all records
    //       });

    //       // Extract mobile numbers
    //       const mobiles = students.docs
    //         .map(student => student.phoneNumber)
    //         .filter(phone => phone)
    //         .join('\n');

    //       // Set CSV headers
    //       res.setHeader('Content-Type', 'text/csv');
    //       res.setHeader('Content-Disposition', 'attachment; filename=active_students_mobiles.csv');

    //       // Send CSV content
    //       res.send(`Mobile Number\n${mobiles.split('\n').map(mobile => `"${mobile}"`).join('\n')}`);
    //     } catch (error) {
    //       console.error('Error exporting mobile numbers:', error);
    //       res.status(500).json({ error: 'Failed to export mobile numbers' });
    //     }
    //   }
    // }
  ],

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

