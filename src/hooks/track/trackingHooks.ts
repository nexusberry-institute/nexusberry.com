// Add this file to your Payload project and import the exported hooks into your collections.
// Hooks call your Next.js API: /api/track

// import type { CollectionAfterChangeHook } from 'payload';
import type { TrackPayload } from "@/app/api/track/route";

// ENV REQUIREMENTS (Client + Server): NEXT_PUBLIC_SERVER_URL
const TRACK_ENDPOINT = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/track`;

const metaTestEventCode = 'TEST13541'

async function postTrack(payload: TrackPayload) {
  try {
    await fetch(TRACK_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    })
  } catch (_e) {
    // Intentionally swallow to avoid blocking CMS operations
    console.error('Tracking Hook error: ', _e);
  }
}

// Leads Collection: Form submitted: fire on create
export const trackFormSubmission =
  () =>
    async ({ operation, doc }: any) => {
      if (operation !== "create") return
      await postTrack({
        eventName: "lead",
        eventSourceUrl: process.env.NEXT_PUBLIC_SERVER_URL,
        actionSource: "system_generated",
        campaignId: doc?.campaignId,
        user: {
          fullName: doc?.name,
          phone: doc?.mobile,
          email: doc?.email,
          city: doc?.city,
          state: doc?.province,
          country: doc?.country,
          externalId: doc?.id ? String(doc.id) : undefined,
        },
        customData: { leadId: doc?.id },
        metaTestEventCode: metaTestEventCode
      })
    }

// Leads Collection: Interested: fire when status first time  flips to LOW, MEDIUM or HIGHS
export const trackInterested =
  () =>
    async ({ operation, doc, previousDoc }: any) => {
      if (operation !== "update") return
      if (!doc.interest_level) return
      if (doc.interest_level?.toUpperCase() == "UNKNOWN") return
      if (previousDoc.interest_level === doc.interest_level) return
      if (
        previousDoc.interest_level?.toUpperCase() === "LOW" ||
        previousDoc.interest_level?.toUpperCase() === "MEGIUM" ||
        previousDoc.interest_level?.toUpperCase() === "HIGH"
      ) return

      await postTrack({
        eventName: "interested",
        eventSourceUrl: process.env.NEXT_PUBLIC_SERVER_URL,
        actionSource: "system_generated",
        campaignId: doc?.campaignId,
        user: {
          fullName: doc?.name,
          phone: doc?.mobile,
          email: doc?.email,
          city: doc?.city,
          state: doc?.province,
          country: doc?.country,
          externalId: doc?.id ? String(doc.id) : undefined,
        },
        customData: { leadId: doc?.id },
        metaTestEventCode: metaTestEventCode
      })
    }

// Leads Collection: Event attended: fire when attended becomes true
export const trackEventAttended =
  () =>
    async ({ operation, doc, previousDoc }: any) => {
      if (operation !== "update") return
      if (doc.eventAttendance?.every(event => event?.hasAttended === false)) return;
      const newlyAttendedEvent = doc.eventAttendance?.find((currentEvent, index) =>
        currentEvent?.hasAttended === true &&
        previousDoc.eventAttendance?.[index]?.hasAttended === false
      ) || null;
      if (!newlyAttendedEvent) return

      await postTrack({
        eventName: "event_attended",
        eventSourceUrl: process.env.NEXT_PUBLIC_SERVER_URL,
        actionSource: "system_generated",
        campaignId: doc?.campaignId,
        user: {
          fullName: doc?.name,
          phone: doc?.mobile,
          email: doc?.email,
          city: doc?.city,
          state: doc?.province,
          country: doc?.country,
          externalId: doc?.id ? String(doc.id) : undefined,
        },
        customData: { eventId: doc?.eventId, registrationId: doc?.id },
        metaTestEventCode: metaTestEventCode
      })
    }

// Students Collection: Admission: fire when new record created
export const trackAdmission =
  () =>
    async ({ operation, doc, previousDoc }: any) => {
      if (operation !== "create") return
      await postTrack({
        eventName: "purchase",
        eventSourceUrl: process.env.NEXT_PUBLIC_SERVER_URL,
        actionSource: "system_generated",
        campaignId: doc?.campaignId,
        user: {
          fullName: doc?.name,
          phone: doc?.mobile,
          email: doc?.email,
          city: doc?.city,
          state: doc?.province,
          country: doc?.country,
          externalId: doc?.id ? String(doc.id) : undefined,
        },
        customData: {
          applicationId: doc?.id,
          value: 50,
          currency: 'USD',
        },
        metaTestEventCode: metaTestEventCode
      })
    }

// claude.ai
// // PayloadCMS Integration (if using PayloadCMS for form handling)
// // payload/hooks/trackingHooks.ts
// import { trackingService } from '@/lib/marketing/tracking-service';
// import type { CollectionAfterChangeHook } from 'payload';

// // Hook for tracking form submissions in PayloadCMS
// export const trackFormSubmission: CollectionAfterChangeHook = async ({
//   doc,
//   req,
//   operation,
//   collection
// }) => {
//   if (operation === 'create') {
//     try {
//       const clientInfo = {
//         ip: req.ip || req.socket?.remoteAddress,
//         userAgent: req.get('User-Agent')
//       };

//       await trackingService.trackFunnelEvent(
//         'form_submitted',
//         {
//           email: doc.email,
//           firstName: doc.firstName,
//           lastName: doc.lastName,
//           phone: doc.phone,
//           ...clientInfo,
//           fbp: req.cookies?._fbp,
//           fbc: req.cookies?._fbc
//         },
//         {
//           form_type: doc.formType || collection.slug,
//           page_url: doc.sourceUrl || req.get('Referer')
//         },
//         req.cookies?._ga || req.cookies['_ga_' + process.env.GA4_MEASUREMENT_ID?.replace('G-', '')]
//       );
//     } catch (error) {
//       console.error('PayloadCMS tracking hook error:', error);
//     }
//   }
// };

// // Hook for tracking event attendance
// export const trackEventAttendance: CollectionAfterChangeHook = async ({
//   doc,
//   req,
//   operation,
//   collection
// }) => {
//   if (operation === 'update' && doc?.hasAttended) {
//     try {
//       const clientInfo = {
//         ip: req.ip || req.socket?.remoteAddress,
//         userAgent: req.get('User-Agent')
//       };

//       await trackingService.trackFunnelEvent(
//         'event_attended',
//         {
//           email: doc.email,
//           ...clientInfo,
//           fbp: req.cookies?._fbp,
//           fbc: req.cookies?._fbc
//         },
//         {
//           event_name: doc.eventName,
//           event_date: doc.eventDate,
//           page_url: req.get('Referer')
//         },
//         req.cookies?._ga
//       );
//     } catch (error) {
//       console.error('PayloadCMS event tracking hook error:', error);
//     }
//   }
// };

// // Hook for tracking admissions
// export const trackAdmission: CollectionAfterChangeHook = async ({
//   doc,
//   req,
//   operation,
//   collection
// }) => {
//   if (operation === 'create') {
//     try {
//       const clientInfo = {
//         ip: req.ip || req.socket?.remoteAddress,
//         userAgent: req.get('User-Agent')
//       };

//       await trackingService.trackFunnelEvent(
//         'admission',
//         {
//           email: doc.email,
//           ...clientInfo,
//           fbp: req.cookies?._fbp,
//           fbc: req.cookies?._fbc
//         },
//         {
//           admission_type: doc.admissionType,
//           value: doc.value,
//           currency: doc.currency || 'USD',
//           page_url: req.get('Referer')
//         },
//         req.cookies?._ga
//       );
//     } catch (error) {
//       console.error('PayloadCMS admission tracking hook error:', error);
//     }
//   }
// };
