// app/api/track/pageview/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { trackingService } from '@/lib/marketing/tracking-service';
import { extractClientInfo } from '@/lib/marketing/tracking-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, fbp, fbc, page_url } = body;
    const { ip, userAgent } = extractClientInfo(request);

    await trackingService.trackFunnelEvent(
      'pageview',
      {
        ip,
        userAgent,
        fbp,
        fbc
      },
      {
        page_url
      },
      clientId
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Pageview tracking error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}