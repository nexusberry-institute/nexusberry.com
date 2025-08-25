import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { utm } = req.body
    if (!utm) return res.status(400).json({ message: 'Missing utm' })

    // Use server-side payload instance via dynamic import to avoid circular issues
    const { getPayload } = await import('payload')
    const config = (await import('@/payload.config')).default
    const payload = await getPayload({ config })

    // use any to avoid strict CollectionSlug typing issues in the serverless build
    const campaigns = await (payload as any).find({
      collection: 'campaigns',
      where: { utm: { equals: utm } },
      limit: 1,
      pagination: false,
    })

    const campaign = campaigns.docs?.[0]
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' })

    // update via any to avoid strict typings for custom fields
    await (payload as any).update({
      collection: 'campaigns',
      id: campaign.id as any,
      data: { visitorCount: (campaign.visitorCount || 0) + 1 },
    })

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}
