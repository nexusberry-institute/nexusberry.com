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
  async ({ operation, doc, req }) => {
    if (operation !== "create") return

    // Fetch email from the related User if available
    let email: string | undefined
    if (doc?.user) {
      try {
        const userId = typeof doc.user === 'object' ? doc.user.id : doc.user
        const user = await req.payload.findByID({
          collection: 'users',
          id: userId,
          select: { email: true },
          depth: 0,
          req,
        })
        email = user?.email
      } catch (_e) {
        // Swallow — tracking shouldn't block operations
      }
    }

    await postTrack({
      eventName: "purchase",
      eventSourceUrl: process.env.NEXT_PUBLIC_SERVER_URL,
      actionSource: "system_generated",
      campaignId: doc?.campaignId,
      user: {
        fullName: doc?.fullName,
        phone: doc?.phoneNumber,
        email,
        city: doc?.address?.city,
        state: doc?.address?.province,
        country: doc?.address?.country,
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
