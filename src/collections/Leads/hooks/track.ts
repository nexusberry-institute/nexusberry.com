// import these hooks into payload collections.
// Hooks call Next.js API: /api/track

import type { TrackPayload } from "@/app/api/track/route";
import type { CollectionAfterChangeHook } from 'payload';
import type { FieldHook } from 'payload'

const TRACK_ENDPOINT = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/track`;
const metaTestEventCode = undefined

async function postTrack(payload: TrackPayload) {
  try {
    await fetch(TRACK_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    })
  } catch (_e) {
    // Intentionally swallow to avoid blocking CMS operations
    console.log(_e)
  }
}

// Leads Collection: Form submitted: fire on create
export const trackLeadSubmission: CollectionAfterChangeHook =
  async ({ operation, doc }) => {
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
      ...(metaTestEventCode ? { metaTestEventCode } : {}),
    })
  }

// Leads Collection: Interested: fire when stage first changes to QUALIFIED or NEGOTIATION
// Uses stage field: NEW -> QUALIFIED/NEGOTIATION indicates interest
export const trackInterestedLead: FieldHook =
  async ({ value, previousValue, operation, originalDoc: doc }) => {
    const interestedStages = ["QUALIFIED", "NEGOTIATION"]

    if (
      operation !== "update" ||
      !value ||
      value === previousValue ||
      !interestedStages.includes(value) ||
      interestedStages.includes(previousValue)
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
      customData: { leadId: doc?.id, stage: value },
      ...(metaTestEventCode ? { metaTestEventCode } : {}),
    })
  }

// Leads Collection: Event attended: fire when attended becomes true
// FIELD eventAttendance is a array of event object
export const trackLeadEventAttendance: FieldHook =
  async ({ value, previousValue, operation, originalDoc: doc }) => {
    if (operation !== "update") return
    if (!value) return
    if (!Array.isArray(value)) return
    if (value?.every(event => event?.hasAttended === false)) return;
    const newlyAttendedEvent = value?.find((currentEvent, index) =>
      currentEvent?.hasAttended === true &&
      previousValue?.[index]?.hasAttended === false
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
      ...(metaTestEventCode ? { metaTestEventCode } : {}),
    })
  }
