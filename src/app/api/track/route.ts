// Location: src/app/api/track/route.ts, EndPoint: /api/track

import { cookies, headers } from "next/headers"
import { NextResponse } from "next/server"
import crypto from "crypto"

/**
 * ENV REQUIREMENTS (Server-only):
 * - FACEBOOK_PIXEL_ID
 * - FACEBOOK_ACCESS_TOKEN
 * - GA4_MEASUREMENT_ID
 * - GA4_API_SECRET
 */

type EventName = "page_view" | "form_submitted" | "interested" | "event_attended" | "admission" | string
type ActionSource = 'website' | 'whatsapp' | 'sms' | 'phone_call' | 'fbchat' | 'physical_store' | 'system_generated' | 'email' | 'app' | 'other' | string

export type TrackPayload = {
  eventName: EventName
  campaignId?: string
  eventId?: string
  eventSourceUrl?: string
  actionSource?: ActionSource
  user?: {
    fullName?: string
    phone?: string
    email?: string
    city?: string
    state?: string
    country?: string
    externalId?: string
    clientId?: string
  }
  customData?: Record<string, any>
  metaTestEventCode?: string
}

function normalizeLower(v?: string) {
  return v ? v.trim().toLowerCase() : undefined
}

function sha256(input?: string) {
  if (!input) return undefined
  const norm = input.trim().toLowerCase()
  if (!norm) return undefined
  return crypto.createHash("sha256").update(norm).digest("hex")
}

function onlyDigits(v?: string) {
  return v ? v.replace(/\D+/g, "") : undefined
}

function splitFullName(fullName?: string) {
  const n = normalizeLower(fullName) || ""
  if (!n) return { fn: undefined, ln: undefined }
  const parts = n.split(/\s+/)
  if (parts.length === 1) return { fn: parts[0], ln: undefined }
  return { fn: parts.slice(0, -1).join(" "), ln: parts[parts.length - 1] }
}

function toMetaEventName(name: TrackPayload["eventName"]): string {
  switch (name) {
    case "page_view":
      return "PageView"
    case "form_submitted":
      // Could also map to "Lead" depending on your setup
      return "FormSubmitted"
    case "interested":
      return "Interested"
    case "event_attended":
      return "EventAttended"
    case "admission":
      return "Admission"
    default:
      return String(name)
  }
}

function nowInSeconds() {
  return Math.floor(Date.now() / 1000)
}

async function sendToMetaCapi(payload: {
  eventName: string
  eventId?: string
  eventTime: number
  eventSourceUrl?: string
  actionSource?: TrackPayload["actionSource"]
  fbp?: string
  fbc?: string
  ip?: string
  ua?: string
  user?: TrackPayload["user"]
  campaignId?: string
  customData?: Record<string, unknown>
  testEventCode?: string
}) {
  const pixelId = process.env.FACEBOOK_PIXEL_ID
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN
  if (!pixelId || !accessToken) {
    return { ok: false, error: "Missing META_PIXEL_ID or META_CAPI_ACCESS_TOKEN" }
  }

  const split = splitFullName(payload.user?.fullName)
  const em = sha256(payload.user?.email)
  const ph = sha256(onlyDigits(payload.user?.phone))
  const fn = sha256(split.fn)
  const ln = sha256(split.ln)
  const ct = sha256(normalizeLower(payload.user?.city))
  const st = sha256(normalizeLower(payload.user?.state))
  const country = sha256(normalizeLower(payload.user?.country))
  const external_id = sha256(payload.user?.externalId)

  const user_data: Record<string, unknown> = {
    ...(em ? { em } : {}),
    ...(ph ? { ph } : {}),
    ...(fn ? { fn } : {}),
    ...(ln ? { ln } : {}),
    ...(ct ? { ct } : {}),
    ...(st ? { st } : {}),
    ...(country ? { country } : {}),
    ...(external_id ? { external_id } : {}),
    ...(payload.fbp ? { fbp: payload.fbp } : {}),
    ...(payload.fbc ? { fbc: payload.fbc } : {}),
    ...(payload.ip ? { client_ip_address: payload.ip } : {}),
    ...(payload.ua ? { client_user_agent: payload.ua } : {}),
  }

  const body: Record<string, any> = {
    data: [
      {
        event_name: payload.eventName,
        event_time: payload.eventTime,
        event_id: payload.eventId,
        event_source_url: payload.eventSourceUrl,
        action_source: payload.actionSource || "system_generated",
        user_data,
        custom_data: {
          ...(payload.customData || {}),
          ...(payload.campaignId ? { campaign_id: payload.campaignId } : {}),
        },
      },
    ],
  }
  if (payload.testEventCode) body["test_event_code"] = payload.testEventCode

  const url = `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })
  const json = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, json }
}

async function sendToGA4(payload: {
  eventName: TrackPayload["eventName"]
  eventTime: number
  clientId?: string
  userId?: string
  eventSourceUrl?: string
  campaignId?: string
  customParams?: Record<string, unknown>
}) {
  const measurementId = process.env.GA4_MEASUREMENT_ID
  const apiSecret = process.env.GA4_API_SECRET
  if (!measurementId || !apiSecret) {
    return { ok: false, error: "Missing GA4_MEASUREMENT_ID or GA4_API_SECRET" }
  }

  const events = [
    {
      name: String(payload.eventName), // keep snake_case as provided
      params: {
        page_location: payload.eventSourceUrl,
        ...(payload.campaignId ? { campaign_id: payload.campaignId } : {}),
        ...payload.customParams,
      },
    },
  ]

  const body: Record<string, unknown> = {
    client_id: payload.clientId || crypto.randomUUID(),
    user_id: payload.userId,
    events,
  }

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(
    measurementId,
  )}&api_secret=${encodeURIComponent(apiSecret)}`
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })
  const text = await res.text().catch(() => "")
  return { ok: res.ok, status: res.status, text }
}

export async function POST(req: Request) {
  try {
    const h = await headers()
    const ua = h.get("user-agent") || undefined
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || ""

    const cookieStore = await cookies()
    const fbp = cookieStore.get("_fbp")?.value
    const fbc = cookieStore.get("_fbc")?.value
    const ga = cookieStore.get("_ga")?.value

    const body = (await req.json()) as TrackPayload

    const eventName = body.eventName
    const eventId = body.eventId || crypto.randomUUID()
    const eventTime = nowInSeconds()
    const eventSourceUrl = body.eventSourceUrl || h.get("referer") || undefined

    // Prefer clientId explicitly supplied by caller; else derive from _ga
    const clientId =
      body.user?.clientId ||
      (ga && ga.startsWith("GA")
        ? (() => {
          const p = ga.split(".")
          return p.length >= 4 ? `${p[2]}.${p[3]}` : undefined
        })()
        : undefined)

    // Send to Meta CAPI
    const metaRes = await sendToMetaCapi({
      eventName: toMetaEventName(eventName),
      eventId,
      eventTime,
      eventSourceUrl,
      actionSource: body.actionSource,
      fbp,
      fbc,
      ip,
      ua,
      user: body.user,
      campaignId: body.campaignId,
      customData: body.customData,
      testEventCode: body.metaTestEventCode,
    })

    // Send to GA4 Measurement Protocol
    const gaRes = await sendToGA4({
      eventName,
      eventTime,
      clientId,
      userId: body.user?.externalId,
      eventSourceUrl,
      campaignId: body.campaignId,
      customParams: body.customData,
    })

    return NextResponse.json(
      { ok: !!(metaRes as any).ok && !!(gaRes as any).ok, meta: metaRes, ga4: gaRes, eventId },
      { status: (metaRes as any).ok && (gaRes as any).ok ? 200 : 207 },
    )
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Unknown error" }, { status: 500 })
  }
}






// prev version
// Forwards events to Meta CAPI and GA4 Measurement Protocol

// Notes:
// - Hashing: PII is SHA-256 hashed server-side, as Meta requires.
// - fbp/fbc/client_ip/user_agent: Sent to Meta for best match quality.
// - GA4: Uses Measurement Protocol; minimal fields shown (extend as needed).

// - Event names:
// - My sales funnel:
// - pageview -> form submitted -> interest_level -> event attended -> admission
// - Meta: PageView, Lead, EventAttended, Admission (customs are fine—create Custom Conversions).
// - GA4: page_view, form_submitted, event_attended, admission (friendly snake_case).

// import { randomUUID, createHash } from "crypto"

// type TrackPayload = {
//   eventName: "page_view" | "form_submitted" | "interested" | "event_attended" | "admission" | string
//   campaignId?: string
//   eventId?: string
//   eventSourceUrl?: string
//   actionSource?: 'website' | 'whatsapp' | 'sms' | 'phone_call' | 'fbchat' | 'physical_store' | 'system_generated' | 'email' | 'app' | 'other' | string
//   user?: {
//     fullName?: string
//     phone?: string
//     email?: string
//     city?: string;
//     state?: string;
//     country?: string;
//     externalId?: string
//     clientId?: string // optional client_id if you capture it client-side
//   }
//   customData?: Record<string, any>
//   metaTestEventCode?: string // set only during testing in Meta Events Manager
// }

// function parseCookies(cookieHeader: string | null) {
//   const out: Record<string, string> = {}
//   if (!cookieHeader) return out
//   cookieHeader.split(";").forEach((part) => {
//     const [k, ...rest] = part.trim().split("=")
//     if (!k) return
//     out[k] = rest.join("=")
//   })
//   return out
// }

// function normalizeEmail(v?: string) {
//   return v ? v.trim().toLowerCase() : undefined
// }
// function normalizeName(v?: string) {
//   return v ? v.trim().toLowerCase() : undefined
// }
// function normalizePhone(v?: string) {
//   if (!v) return undefined
//   // Digits only per Meta hashing guidance
//   const digits = v.replace(/\D+/g, "")
//   return digits || undefined
// }
// function sha256Hex(v?: string) {
//   if (!v) return undefined
//   return createHash("sha256").update(v, "utf8").digest("hex")
// }

// function mapMetaEventName(name: string) {
//   switch (name) {
//     case "page_view":
//       return "PageView"
//     case "form_submitted":
//       // Choose a standard event. Lead is a good fit for generic form submissions.
//       return "Lead"
//     case "event_attended":
//       return "EventAttended" // custom event
//     case "admission":
//       return "Admission" // custom event
//     default:
//       return name // pass-through custom event name
//   }
// }

// function mapGaEventName(name: string) {
//   // GA4 can use your own names; keep snake_case for consistency
//   return name
// }

// export async function POST(req: Request) {
//   try {
//     const body = (await req.json()) as TrackPayload
//     const now = Math.floor(Date.now() / 1000)

//     // Headers and cookies (to get IP/UA/fbp/fbc/_ga)
//     const headers = req.headers
//     const ua = headers.get("user-agent") || undefined
//     const xff = headers.get("x-forwarded-for") || ""
//     const clientIp = xff.split(",")[0]?.trim() || undefined
//     const cookies = parseCookies(headers.get("cookie"))

//     const fbp = cookies["_fbp"]
//     const fbc = cookies["_fbc"]
//     const gaCookie = cookies["_ga"]

//     // Try to derive GA-like client_id from _ga if not provided
//     let clientId = body.user?.clientId
//     if (!clientId && gaCookie && gaCookie.indexOf("GA") === 0) {
//       const parts = gaCookie.split(".")
//       if (parts.length >= 4) clientId = `${parts[2]}.${parts[3]}`
//     }
//     if (!clientId) {
//       // last resort: create a temporary anonymous cid so GA4 accepts the hit
//       clientId = `anon.${randomUUID()}`
//     }

//     // UserData: Build Meta user_data (hash PII per Meta requirements)
//     const fn = sha256Hex(normalizeName(body.user?.fullName))
//     const ph = sha256Hex(normalizePhone(body.user?.phone))
//     const em = sha256Hex(normalizeEmail(body.user?.email))
//     const city = sha256Hex(normalizeName(body.user?.city))
//     const state = sha256Hex(normalizeName(body.user?.state))
//     const country = sha256Hex(normalizeName(body.user?.country))
//     const externalId = body.user?.externalId ? sha256Hex(String(body.user.externalId)) : undefined

//     // EventData: Common fields
//     const campaignId = body.eventId
//     const eventId = body.eventId || randomUUID()
//     const eventSourceUrl = body.eventSourceUrl
//     const actionSource = body.actionSource || "website"

//     // 1) Send to Meta CAPI (if configured)
//     let metaResponse: any = null
//     if (process.env.FACEBOOK_PIXEL_ID && process.env.FACEBOOK_ACCESS_TOKEN) {
//       const metaEvent = {
//         data: [
//           {
//             event_name: mapMetaEventName(body.eventName),
//             event_time: now,
//             event_id: eventId,
//             action_source: actionSource,
//             event_source_url: eventSourceUrl,
//             user_data: {
//               // Only include fields when present
//               ...(fbp ? { fbp } : {}),
//               ...(fbc ? { fbc } : {}),
//               ...(clientIp ? { client_ip_address: clientIp } : {}),
//               ...(ua ? { client_user_agent: ua } : {}),
//               ...(fn ? { fn: [fn] } : {}),
//               ...(ph ? { ph: [ph] } : {}),
//               ...(em ? { em: [em] } : {}),
//               ...(city ? { city: [city] } : {}),
//               ...(state ? { state: [state] } : {}),
//               ...(country ? { country: [country] } : {}),
//               ...(externalId ? { external_id: [externalId] } : {}),
//             },
//             // Optional custom data for richer reporting
//             ...(body.customData ? { custom_data: body.customData } : {}),
//           },
//         ],
//         // Include during testing from Meta Events Manager (Test Events)
//         ...(body.metaTestEventCode ? { test_event_code: body.metaTestEventCode } : {}),
//       }

//       const url = `https://graph.facebook.com/v17.0/${process.env.META_PIXEL_ID}/events?access_token=${process.env.META_CAPI_ACCESS_TOKEN}`
//       const res = await fetch(url, {
//         method: "POST",
//         headers: { "content-type": "application/json" },
//         body: JSON.stringify(metaEvent),
//       })
//       metaResponse = await res.json().catch(() => ({}))
//     }

//     // 2) Send to GA4 Measurement Protocol (if configured)
//     let gaResponse: any = null
//     if (process.env.GA4_MEASUREMENT_ID && process.env.GA4_API_SECRET) {
//       const gaEvent = {
//         client_id: clientId,
//         events: [
//           {
//             name: mapGaEventName(body.eventName),
//             params: {
//               // Recommended params
//               page_location: eventSourceUrl,
//               // add your own params as needed (values, IDs, etc.)
//             },
//           },
//         ],
//         // Optionally: user_properties, user_id, non_personalized_ads, etc.
//       }

//       const gaUrl = `https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA4_MEASUREMENT_ID}&api_secret=${process.env.GA4_API_SECRET}`
//       const res = await fetch(gaUrl, {
//         method: "POST",
//         headers: {
//           "content-type": "application/json",
//           // GA4 may use this header for UA attribution
//           ...(ua ? { "user-agent": ua } : {}),
//         },
//         body: JSON.stringify(gaEvent),
//       })
//       // GA4 returns empty body on success; keep for debugging
//       gaResponse = { status: res.status }
//     }

//     return Response.json(
//       {
//         ok: true,
//         eventId,
//         forwarded: {
//           meta: metaResponse,
//           ga4: gaResponse,
//         },
//       },
//       { status: 200 }
//     )
//   } catch (e: any) {
//     return Response.json({ ok: false, error: e?.message || "Unknown error" }, { status: 500 })
//   }
// }