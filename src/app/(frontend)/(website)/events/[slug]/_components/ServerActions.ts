// 'use server'

// import { getPayload } from 'payload'
// import config from '@payload-config'
// import { redirect } from 'next/navigation'
// import { isRedirectError } from 'next/dist/client/components/redirect-error'

// interface FormData {
//   email: string
//   phoneNumber: string
//   name: string
//   eventId: number
//   campaignId: number | null
// }

// export default async function CreateEventRegistration(data: FormData) {
//   try {
//     const payload = await getPayload({ config })

//     // Look for any existing leads by phone OR email
//     const leads = await payload.find({
//       collection: 'leads',
//       where: {
//         or: [
//           { mobile: { equals: data.phoneNumber } },
//           { email: { equals: data.email } },
//         ],
//       },
//       depth: 0,
//     })
//     console.log("leads: ", JSON.stringify(leads, null, 2));

//     const phoneLead = leads.docs.find((l) => l.mobile === data.phoneNumber)
//     const emailLead = leads.docs.find((l) => l.email === data.email)
//     console.log("phoneLead: ", phoneLead);
//     console.log("emailLead: ", emailLead);

//     // return {
//     //   success: true,
//     //   message: "Your registration has been completed.",
//     //   error: null,
//     // }
//     // ---- CASE 1: Both phone + email match same lead → already registered ----
//     if (phoneLead && emailLead && phoneLead.id === emailLead.id) {
//       const alreadyRegistered = (phoneLead.eventAttendance || []).some(
//         (regEvent) => regEvent.event === data.eventId
//       )

//       const queryParams = new URLSearchParams({
//         name: data.name,
//         eventId: String(data.eventId),
//         from: "alreadyRegistered | newRegistration"
//       }).toString();

//       if (alreadyRegistered) {
//         // return {
//         //   success: false,
//         //   message: null,
//         //   error: "You are already registered for this event.",
//         // }

//         redirect(`/registration-success?${queryParams}`)
//       }

//       // Append event to existing lead
//       const newRegistration = {
//         event: data.eventId,
//         hasAttended: false,
//         ...(data.campaignId ? { campaign: data.campaignId } : {}),
//       }

//       await payload.update({
//         collection: 'leads',
//         id: phoneLead.id,
//         data: {
//           eventAttendance: [...(phoneLead.eventAttendance || []), newRegistration],
//         },
//       })

//       // return {
//       //   success: true,
//       //   message: "Your registration has been completed.",
//       //   error: null,
//       // }
//       redirect(`/registration-success?${queryParams}`)
//     }

//     // ---- CASE 4: Both phone + email exist but in different accounts ----
//     if (phoneLead && emailLead && phoneLead.id !== emailLead.id) {
//       // return {
//       //   success: false,
//       //   message: null,
//       //   error: "Both phone number and email are already in use with different accounts.",
//       // }
//       throw new Error("Both phone number and email are already in use with different accounts.")
//     }

//     // ---- CASE 2: Phone exists but email belongs to no one OR to a different one ----
//     if (phoneLead && !emailLead) {
//       // return {
//       //   success: false,
//       //   message: null,
//       //   error: "This phone number is already associated with another email.",
//       // }
//       throw new Error("This phone number is already associated with another email.")
//     }

//     // ---- CASE 3: Email exists but phone belongs to no one OR to a different one ----
//     if (emailLead && !phoneLead) {
//       // return {
//       //   success: false,
//       //   message: null,
//       //   error: "This email is already associated with another phone number.",
//       // }
//       throw new Error("This email is already associated with another phone number.")
//     }

//     // ---- CASE 5: Neither exists → create new lead ----
//     const newRegistration = {
//       event: data.eventId,
//       hasAttended: false,
//       ...(data.campaignId ? { campaign: data.campaignId } : {}),
//     }

//     await payload.create({
//       collection: 'leads',
//       data: {
//         name: data.name,
//         email: data.email,
//         mobile: data.phoneNumber,
//         eventAttendance: [newRegistration],
//       },
//     })

//     const queryParams = new URLSearchParams({
//       name: data.name,
//       eventId: String(data.eventId),
//       from: "newleadAndEvent"
//     }).toString();

//     redirect(`/events/mern-stack-course-free-demo/registration-success?${queryParams}`)

//     // return {
//     //   success: true,
//     //   message: "Your registration has been completed.",
//     //   error: null,
//     // }
//   } catch (error) {
//     console.error("error: ", JSON.stringify(error, null, 2))
//     if (isRedirectError(error)) {
//       throw error;
//     };

//     return {
//       success: false,
//       message: null,
//       error: error instanceof Error ? error.message : error,
//     }
//   }
// }

'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { date } from 'zod'

interface FormData {
  email: string
  phoneNumber: string
  name: string
  eventId: number
  campaignId: number | null
}

export default async function CreateEventRegistration(data: FormData) {
  try {
    const payload = await getPayload({ config })

    // Look for any existing leads by phone OR email
    const leads = await payload.find({
      collection: 'leads',
      where: {
        or: [
          { mobile: { equals: data.phoneNumber } },
          { email: { equals: data.email } },
        ],
      },
      select: {
        mobile: true,
        email: true,
        eventAttendance: {
          event: true,
          hasAttended: true,
          campaign: true
        }
      },
      depth: 0,
    })

    const phoneLead = leads.docs.find((l) => l.mobile === data.phoneNumber)
    const emailLead = leads.docs.find((l) => l.email === data.email)

    // ---- CASE 1: Both phone + email match same lead → already registered ----
    if (phoneLead && emailLead && phoneLead.id === emailLead.id) {
      const alreadyRegistered = (phoneLead.eventAttendance || []).some(
        (regEvent) => regEvent.event === data.eventId
      )

      if (alreadyRegistered) {
        return {
          success: true,
          error: null,
        }
      }

      // Append event to existing lead
      const newRegistration = {
        event: data.eventId,
        hasAttended: false,
        source: data.campaignId ? `camp-${data.campaignId}` : "website-nxb",
        registeredAt: new Date().toISOString(),
        ...(data.campaignId ? { campaign: data.campaignId } : {}),
      }

      await payload.update({
        collection: 'leads',
        id: phoneLead.id,
        data: {
          eventAttendance: [...(phoneLead.eventAttendance || []), newRegistration],
        },
      })

      return {
        success: true,
        error: null
      }
    }

    // ---- CASE 4: Both phone + email exist but in different accounts ----
    if (phoneLead && emailLead && phoneLead.id !== emailLead.id) {
      return {
        success: false,
        error: {
          type: "validation",
          email: "This email is already registered.",
          phoneNumber: "This phone number is already registered."
        }
      }
    }

    // ---- CASE 2: Phone exists but email belongs to no one OR to a different one ----
    if (phoneLead && !emailLead) {
      return {
        success: false,
        error: {
          type: "validation",
          email: null,
          phoneNumber: "This phone number is already registered."
        }
      }
    }

    // ---- CASE 3: Email exists but phone belongs to no one OR to a different one ----
    if (emailLead && !phoneLead) {
      return {
        success: false,
        error: {
          type: "validation",
          email: "This email is already registered.",
          phoneNumber: null
        }
      }
    }

    const source = data.campaignId ? `camp-${data.campaignId}` : "website-nxb";

    // ---- CASE 5: Neither exists → create new lead ----
    const newRegistration = {
      event: data.eventId,
      hasAttended: false,
      source,
      registeredAt: new Date().toISOString(),
      ...(data.campaignId ? { campaign: data.campaignId } : {}),
    }

    await payload.create({
      collection: 'leads',
      data: {
        name: data.name,
        email: data.email,
        mobile: data.phoneNumber,
        eventAttendance: [newRegistration],
        source
      },
    })

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    console.error("error: ", JSON.stringify(error, null, 2))
    return {
      success: false,
      error: {
        type: "api",
        message: error instanceof Error ? error.message : error,
      },
    }
  }
}