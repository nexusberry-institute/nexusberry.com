// import these hooks into payload collections.
// Hooks call Next.js API: /api/track

import type { TrackPayload } from "@/app/api/track/route";
import type { CollectionAfterChangeHook } from 'payload';

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
  }
}

// Students Collection: Admission: fire when new record created
export const trackNewStudentAdmission: CollectionAfterChangeHook =
  async ({ operation, doc }) => {
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
        value: 50.00,
        currency: 'USD',
      },
      ...(metaTestEventCode ? { metaTestEventCode } : {}),
    })
  }