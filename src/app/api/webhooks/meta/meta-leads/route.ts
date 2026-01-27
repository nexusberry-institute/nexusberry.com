import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { createHmac } from "node:crypto"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const mode = searchParams.get('hub.mode')
    const token = searchParams.get('hub.verify_token')
    const challenge = searchParams.get('hub.challenge')

    if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
        return new NextResponse(challenge, { status: 200 })
    }

    return new NextResponse('Forbidden', { status: 403 })
}


export async function POST(request: NextRequest) {
    try {
        if (!process.env.META_APP_SECRET) {
            return new NextResponse('Server misconfigured', { status: 500 })
        }

        const body = await request.text()
        const signature = request.headers.get('x-hub-signature-256')

        // Verify signature
        const expectedSignature = 'sha256=' + createHmac('sha256', process.env.META_APP_SECRET)
            .update(body)
            .digest('hex')

        if (signature !== expectedSignature) {
            return new NextResponse('Invalid signature', { status: 403 })
        }

        const data = JSON.parse(body)
        // console.log("dataFromMetaWebhook: ", JSON.stringify(data, null, 2));

        const results = { processed: 0, failed: 0 };

        // Process webhook
        if (data.object === 'page' && Array.isArray(data.entry)) {
            for (const entry of data.entry) {
                if (!Array.isArray(entry.changes)) continue
                for (const change of entry.changes) {
                    if (change.field === 'leadgen') {
                        try {
                            const leadId = change.value.leadgen_id
                            const formId = change.value.form_id

                            // Fetch lead data from Meta
                            await fetchAndStoreLead({ leadId, formId })
                            results.processed++
                        } catch (error) {
                            // console.error("Failed to process lead:", error)
                            results.failed++
                        }
                    }
                }
            }
        }

        return NextResponse.json({ success: true, ...results })
    } catch (error) {
        // console.error("Webhook processing error:", error)
        return NextResponse.json({ error: "Processing failed" }, { status: 500 })
    }
}

async function fetchAndStoreLead({ leadId, formId }: {
    leadId: string
    formId: string
}) {
    // Get Payload instance and check for duplicates
    const payload = await getPayload({ config })

    // do not save duplicate
    const existing = await payload.find({
        collection: "leads",
        where: { metaLeadId: { equals: leadId } },
        select: { name: true },
        limit: 1,
    })

    if (existing.docs.length > 0) {
        // console.log("Lead already exists:", leadId)
        return
    }

    if (!process.env.META_PAGE_ACCESS_TOKEN) {
        throw new Error('META_PAGE_ACCESS_TOKEN not configured')
    }

    // Fetch from Meta API
    const response = await fetch(
        `https://graph.facebook.com/v23.0/${leadId}?access_token=${process.env.META_PAGE_ACCESS_TOKEN}`,
    )

    if (!response.ok) {
        throw new Error(`Meta API error: ${response.status}`)
    }

    const leadData = await response.json()
    // console.log("leadData: ", JSON.stringify(leadData, null, 2));

    // Transform field data
    const fieldData: Record<string, any> = {}
    leadData.field_data?.forEach((field: any) => {
        if (field.name && field.values?.[0]) {
            fieldData[field.name] = field.values[0]
        }
    })

    // Adaptor: meta lead form data -> payloadcms Leads collection
    await payload.create({
        collection: "leads",
        data: {
            metaLeadId: leadId,
            metaFormId: formId,
            source: "meta_instant_form",
            name: fieldData.full_name || fieldData.name,
            email: fieldData.email,
            mobile: fieldData.phone || fieldData.phone_number || fieldData.mobile_number || fieldData.mobile,
            city: fieldData.city || fieldData.location_city,
            currentBackground: fieldData.currentBackground || fieldData['what_is_your_current_status?'],
            priorExperience: fieldData.priorExperience || fieldData['what_is_your_current_knowledge_of_html,_css,_and_javascript?']
        },
    })
}