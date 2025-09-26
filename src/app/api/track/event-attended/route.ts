// app/api/track/event-attended/route.ts  
import { NextRequest, NextResponse } from 'next/server';
import { trackingService } from '@/lib/marketing/tracking-service';
import { extractClientInfo } from '@/lib/marketing/tracking-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      eventName,
      eventDate,
      clientId,
      fbp,
      fbc,
      page_url
    } = body;

    const { ip, userAgent } = extractClientInfo(request);

    await trackingService.trackFunnelEvent(
      'event_attended',
      {
        email,
        ip,
        userAgent,
        fbp,
        fbc
      },
      {
        event_name: eventName,
        event_date: eventDate,
        page_url
      },
      clientId
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Event attended tracking error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}