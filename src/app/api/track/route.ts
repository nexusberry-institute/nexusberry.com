// // Location: src/app/api/track/route.ts, EndPoint: /api/track
// // https://developers.facebook.com/docs/marketing-api/conversions-api

// import { cookies, headers } from "next/headers"
// import { NextResponse } from "next/server"
// import crypto from "node:crypto"


// /**
//  * ENV REQUIREMENTS (Server-only):
//  * - FACEBOOK_PIXEL_ID
//  * - FACEBOOK_ACCESS_TOKEN
//  * - GA4_MEASUREMENT_ID
//  * - GA4_API_SECRET
//  */

// type EventName = "page_view" | "lead" | "interested" | "event_attended" | "purchase" | string
// type ActionSource = 'website' | 'whatsapp' | 'sms' | 'phone_call' | 'fbchat' | 'physical_store' | 'system_generated' | 'email' | 'app' | 'other' | string

// // https://developers.facebook.com/docs/marketing-api/conversions-api/parameters
// export type TrackPayload = {
//   eventName: EventName
//   campaignId?: string
//   eventId?: string
//   eventSourceUrl?: string
//   actionSource?: ActionSource
//   user?: {
//     fullName?: string // meta fn, ln
//     phone?: string  // meta ph
//     email?: string // meta em
//     city?: string // meta ct
//     state?: string // meta st
//     country?: string // meta country
//     externalId?: string
//     clientId?: string
//   }
//   customData?: Record<string, any>
//   metaTestEventCode?: string
// }

// function normalizeLower(v?: string): string | undefined {
//   return v ? v.trim().toLowerCase() : undefined
// }

// function sha256(input?: string): string | undefined {
//   if (typeof input !== "string") return undefined
//   const norm = input.trim().toLowerCase()
//   if (!norm) return undefined
//   return crypto.createHash("sha256").update(norm, "utf8").digest("hex")
// }


// function onlyDigits(v?: string): string | undefined {
//   return v ? v.replace(/\D+/g, "") : undefined
// }

// function splitFullName(fullName?: string) {
//   const n = normalizeLower(fullName) || ""
//   if (!n) return { fn: undefined, ln: undefined }
//   const parts = n.split(/\s+/)
//   if (parts.length === 1) return { fn: parts[0], ln: undefined }
//   return { fn: parts.slice(0, -1).join(" "), ln: parts[parts.length - 1] }
// }

// // Specifications for Meta Pixel standard events
// // https://business.facebook.com/business/help/402791146561655?id=1205376682832142
// function toMetaEventName(name: TrackPayload["eventName"]): string {
//   switch (name) {
//     case "page_view":
//       return "PageView" // standard event
//     case "lead":
//       return "Lead"  // standard event
//     case "interested":
//       return "Interested"
//     case "event_attended":
//       return "EventAttended"
//     case "purchase":
//       return "Purchase"  // standard event
//     default:
//       return String(name)
//   }
// }

// function nowInSeconds() {
//   return Math.floor(Date.now() / 1000)
// }

// async function sendToMetaCapi(payload: {
//   eventName: string
//   eventId?: string
//   eventTime: number
//   eventSourceUrl?: string
//   actionSource?: TrackPayload["actionSource"]
//   fbp?: string
//   fbc?: string
//   ip?: string
//   ua?: string
//   user?: TrackPayload["user"]
//   campaignId?: string
//   customData?: Record<string, unknown>
//   testEventCode?: string
// }) {
//   const pixelId = process.env.FACEBOOK_PIXEL_ID
//   const accessToken = process.env.FACEBOOK_ACCESS_TOKEN
//   if (!pixelId || !accessToken) {
//     return { ok: false, error: "Missing META_PIXEL_ID or META_CAPI_ACCESS_TOKEN" }
//   }

//   const split = splitFullName(payload.user?.fullName)
//   const em = sha256(payload.user?.email)
//   const ph = sha256(onlyDigits(payload.user?.phone))
//   const fn = sha256(split.fn)
//   const ln = sha256(split.ln)
//   const ct = sha256(normalizeLower(payload.user?.city))
//   const st = sha256(normalizeLower(payload.user?.state))
//   const country = sha256(normalizeLower(payload.user?.country))
//   const external_id = sha256(payload.user?.externalId)

//   const user_data: Record<string, unknown> = {
//     ...(em ? { em } : {}),
//     ...(ph ? { ph } : {}),
//     ...(fn ? { fn } : {}),
//     ...(ln ? { ln } : {}),
//     ...(ct ? { ct } : {}),
//     ...(st ? { st } : {}),
//     ...(country ? { country } : {}),
//     ...(external_id ? { external_id } : {}),
//     ...(payload.fbp ? { fbp: payload.fbp } : {}),
//     ...(payload.fbc ? { fbc: payload.fbc } : {}),
//     ...(payload.ip ? { client_ip_address: payload.ip } : {}),
//     ...(payload.ua ? { client_user_agent: payload.ua } : {}),
//   }

//   const body: Record<string, any> = {
//     data: [
//       {
//         event_name: payload.eventName,
//         event_time: payload.eventTime,
//         event_id: payload.eventId,
//         event_source_url: payload.eventSourceUrl,
//         action_source: payload.actionSource || "system_generated",
//         user_data,
//         custom_data: {
//           ...(payload.customData || {}),
//           ...(payload.campaignId ? { campaign_id: payload.campaignId } : {}),
//         },
//       },
//     ],
//   }
//   if (payload.testEventCode) body["test_event_code"] = payload.testEventCode

//   const url = `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`
//   const res = await fetch(url, {
//     method: "POST",
//     headers: { "content-type": "application/json" },
//     body: JSON.stringify(body),
//   })
//   const json = await res.json().catch(() => ({}))
//   return { ok: res.ok, status: res.status, json }
// }

// async function sendToGA4(payload: {
//   eventName: TrackPayload["eventName"]
//   eventTime: number
//   clientId?: string
//   userId?: string
//   eventSourceUrl?: string
//   campaignId?: string
//   customParams?: Record<string, unknown>
// }) {
//   const measurementId = process.env.GA4_MEASUREMENT_ID
//   const apiSecret = process.env.GA4_API_SECRET
//   if (!measurementId || !apiSecret) {
//     return { ok: false, error: "Missing GA4_MEASUREMENT_ID or GA4_API_SECRET" }
//   }

//   const events = [
//     {
//       name: String(payload.eventName), // keep snake_case as provided
//       params: {
//         page_location: payload.eventSourceUrl,
//         ...(payload.campaignId ? { campaign_id: payload.campaignId } : {}),
//         ...payload.customParams,
//       },
//     },
//   ]

//   const body: Record<string, unknown> = {
//     client_id: payload.clientId || crypto.randomUUID(),
//     user_id: payload.userId,
//     events,
//   }

//   const url = `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(
//     measurementId,
//   )}&api_secret=${encodeURIComponent(apiSecret)}`
//   const res = await fetch(url, {
//     method: "POST",
//     headers: { "content-type": "application/json" },
//     body: JSON.stringify(body),
//   })
//   const text = await res.text().catch(() => "")
//   return { ok: res.ok, status: res.status, text }
// }

// export async function POST(req: Request) {
//   try {
//     const h = await headers()
//     const ua = h.get("user-agent") || undefined
//     const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || ""

//     const cookieStore = await cookies()
//     const fbp = cookieStore.get("_fbp")?.value
//     const fbc = cookieStore.get("_fbc")?.value
//     const ga = cookieStore.get("_ga")?.value

//     const body = (await req.json()) as TrackPayload

//     const eventName = body.eventName
//     const eventId = body.eventId || crypto.randomUUID()
//     const eventTime = nowInSeconds()
//     const eventSourceUrl = body.eventSourceUrl || h.get("referer") || undefined

//     // Prefer clientId explicitly supplied by caller; else derive from _ga
//     const clientId =
//       body.user?.clientId ||
//       (ga && ga.startsWith("GA")
//         ? (() => {
//           const p = ga.split(".")
//           return p.length >= 4 ? `${p[2]}.${p[3]}` : undefined
//         })()
//         : undefined)

//     // Send to Meta CAPI
//     const metaRes = await sendToMetaCapi({
//       eventName: toMetaEventName(eventName),
//       eventId,
//       eventTime,
//       eventSourceUrl,
//       actionSource: body.actionSource,
//       fbp,
//       fbc,
//       ip,
//       ua,
//       user: body.user,
//       campaignId: body.campaignId,
//       customData: body.customData,
//       testEventCode: body.metaTestEventCode,
//     })

//     // Send to GA4 Measurement Protocol
//     const gaRes = await sendToGA4({
//       eventName,
//       eventTime,
//       clientId,
//       userId: body.user?.externalId,
//       eventSourceUrl,
//       campaignId: body.campaignId,
//       customParams: body.customData,
//     })

//     return NextResponse.json(
//       { ok: !!(metaRes as any).ok && !!(gaRes as any).ok, meta: metaRes, ga4: gaRes, eventId },
//       { status: (metaRes as any).ok && (gaRes as any).ok ? 200 : 207 },
//     )
//   } catch (err: any) {
//     return NextResponse.json({ ok: false, error: err?.message || "Unknown error" }, { status: 500 })
//   }
// }

// //////////////////////////////////////////////////////
// Location: src/app/api/track/route.ts, EndPoint: /api/track
// https://developers.facebook.com/docs/marketing-api/conversions-api

import { cookies, headers } from "next/headers"
import { NextResponse } from "next/server"
import crypto from "node:crypto"

/**
 * ENV REQUIREMENTS (Server-only):
 * - FACEBOOK_PIXEL_ID
 * - FACEBOOK_ACCESS_TOKEN
 * - GA4_MEASUREMENT_ID
 * - GA4_API_SECRET
 */

type EventName = "page_view" | "lead" | "interested" | "event_attended" | "purchase" | string
type ActionSource = 'website' | 'whatsapp' | 'sms' | 'phone_call' | 'fbchat' | 'physical_store' | 'system_generated' | 'email' | 'app' | 'other' | string

// https://developers.facebook.com/docs/marketing-api/conversions-api/parameters
export type TrackPayload = {
  eventName: EventName
  campaignId?: string
  eventId?: string
  eventSourceUrl?: string
  actionSource?: ActionSource
  user?: {
    fullName?: string // meta fn, ln
    phone?: string  // meta ph
    email?: string // meta em
    city?: string // meta ct
    state?: string // meta st
    country?: string // meta country
    externalId?: string
    clientId?: string
  }
  customData?: Record<string, any>
  metaTestEventCode?: string
}

function normalizeLower(v?: string): string | undefined {
  if (!v || typeof v !== "string") return undefined
  const trimmed = v.trim().toLowerCase()
  return trimmed || undefined
}

// ✅ FIXED: Added proper type checking and error handling
function sha256(input?: string): string | undefined {
  // Check for falsy or non-string values first
  if (!input || typeof input !== "string") return undefined

  const norm = input.trim().toLowerCase()
  if (!norm) return undefined

  try {
    return crypto.createHash("sha256").update(norm, "utf8").digest("hex")
  } catch (error) {
    console.error("SHA256 hash error:", error, "Input type:", typeof input)
    return undefined
  }
}

function onlyDigits(v?: string): string | undefined {
  if (!v || typeof v !== "string") return undefined
  const digits = v.replace(/\D+/g, "")
  return digits || undefined
}

function splitFullName(fullName?: string) {
  const n = normalizeLower(fullName)
  if (!n) return { fn: undefined, ln: undefined }

  const parts = n.split(/\s+/).filter(Boolean) // Remove empty strings
  if (parts.length === 0) return { fn: undefined, ln: undefined }
  if (parts.length === 1) return { fn: parts[0], ln: undefined }

  return {
    fn: parts.slice(0, -1).join(" "),
    ln: parts[parts.length - 1]
  }
}

// Specifications for Meta Pixel standard events
// https://business.facebook.com/business/help/402791146561655?id=1205376682832142
function toMetaEventName(name: TrackPayload["eventName"]): string {
  if (!name) return "PageView" // Default fallback

  switch (name) {
    case "page_view":
      return "PageView" // standard event
    case "lead":
      return "Lead"  // standard event
    case "interested":
      return "Interested"
    case "event_attended":
      return "EventAttended"
    case "purchase":
      return "Purchase"  // standard event
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
    console.warn("Meta CAPI: Missing FACEBOOK_PIXEL_ID or FACEBOOK_ACCESS_TOKEN")
    return { ok: false, error: "Missing FACEBOOK_PIXEL_ID or FACEBOOK_ACCESS_TOKEN" }
  }

  // ✅ Safely process user data with proper validation
  const split = splitFullName(payload.user?.fullName)
  const em = sha256(payload.user?.email)
  const ph = sha256(onlyDigits(payload.user?.phone))
  const fn = sha256(split.fn)
  const ln = sha256(split.ln)
  const ct = sha256(normalizeLower(payload.user?.city))
  const st = sha256(normalizeLower(payload.user?.state))
  const country = sha256(normalizeLower(payload.user?.country))
  const external_id = sha256(payload.user?.externalId)

  // ✅ Build user_data object, only including defined values
  const user_data: Record<string, unknown> = {}

  if (em) user_data.em = em
  if (ph) user_data.ph = ph
  if (fn) user_data.fn = fn
  if (ln) user_data.ln = ln
  if (ct) user_data.ct = ct
  if (st) user_data.st = st
  if (country) user_data.country = country
  if (external_id) user_data.external_id = external_id
  if (payload.fbp) user_data.fbp = payload.fbp
  if (payload.fbc) user_data.fbc = payload.fbc
  if (payload.ip) user_data.client_ip_address = payload.ip
  if (payload.ua) user_data.client_user_agent = payload.ua

  const event_data: Record<string, any> = {
    event_name: payload.eventName,
    event_time: payload.eventTime,
    action_source: payload.actionSource || "system_generated",
    user_data,
  }

  // Only add optional fields if they exist
  if (payload.eventId) event_data.event_id = payload.eventId
  if (payload.eventSourceUrl) event_data.event_source_url = payload.eventSourceUrl

  // Custom data
  const custom_data: Record<string, any> = { ...(payload.customData || {}) }
  if (payload.campaignId) custom_data.campaign_id = payload.campaignId

  if (Object.keys(custom_data).length > 0) {
    event_data.custom_data = custom_data
  }

  const body: Record<string, any> = {
    data: [event_data],
  }

  if (payload.testEventCode) {
    body.test_event_code = payload.testEventCode
  }

  try {
    const url = `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    })

    const json = await res.json().catch(() => ({ error: "Failed to parse response" }))

    if (!res.ok) {
      console.error("Meta CAPI error:", res.status, json)
    }

    return { ok: res.ok, status: res.status, json }
  } catch (error) {
    console.error("Meta CAPI request failed:", error)
    return { ok: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
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
    console.warn("GA4: Missing GA4_MEASUREMENT_ID or GA4_API_SECRET")
    return { ok: false, error: "Missing GA4_MEASUREMENT_ID or GA4_API_SECRET" }
  }

  const event_params: Record<string, any> = {
    ...(payload.customParams || {}),
  }

  if (payload.eventSourceUrl) event_params.page_location = payload.eventSourceUrl
  if (payload.campaignId) event_params.campaign_id = payload.campaignId

  const events = [
    {
      name: String(payload.eventName || "page_view"),
      params: event_params,
    },
  ]

  const body: Record<string, unknown> = {
    client_id: payload.clientId || crypto.randomUUID(),
    events,
  }

  if (payload.userId) {
    body.user_id = payload.userId
  }

  try {
    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(
      measurementId,
    )}&api_secret=${encodeURIComponent(apiSecret)}`

    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    })

    const text = await res.text().catch(() => "")

    if (!res.ok) {
      console.error("GA4 error:", res.status, text)
    }

    return { ok: res.ok, status: res.status, text }
  } catch (error) {
    console.error("GA4 request failed:", error)
    return { ok: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function POST(req: Request) {
  try {
    const h = await headers()
    const ua = h.get("user-agent") || undefined
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || undefined

    const cookieStore = await cookies()
    const fbp = cookieStore.get("_fbp")?.value
    const fbc = cookieStore.get("_fbc")?.value
    const ga = cookieStore.get("_ga")?.value

    const body = (await req.json()) as TrackPayload

    // Validate required fields
    if (!body || !body.eventName) {
      return NextResponse.json(
        { ok: false, error: "Missing required field: eventName" },
        { status: 400 }
      )
    }

    const eventName = body.eventName
    const eventId = body.eventId || crypto.randomUUID()
    const eventTime = nowInSeconds()
    const eventSourceUrl = body.eventSourceUrl || h.get("referer") || undefined

    // Prefer clientId explicitly supplied by caller; else derive from _ga
    let clientId = body.user?.clientId

    if (!clientId && ga && typeof ga === "string" && ga.startsWith("GA")) {
      const parts = ga.split(".")
      if (parts.length >= 4) {
        clientId = `${parts[2]}.${parts[3]}`
      }
    }

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

    const bothOk = metaRes.ok && gaRes.ok

    return NextResponse.json(
      {
        ok: bothOk,
        meta: metaRes,
        ga4: gaRes,
        eventId
      },
      { status: bothOk ? 200 : 207 }
    )
  } catch (err: any) {
    console.error("Track API error:", err)
    return NextResponse.json(
      { ok: false, error: err?.message || "Unknown error" },
      { status: 500 }
    )
  }
}