// app/api/track/form-submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { trackingService } from '@/lib/marketing/tracking-service';
import { extractClientInfo } from '@/lib/marketing/tracking-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      phone,
      firstName,
      lastName,
      city,
      state,
      country,
      zipCode,
      clientId,
      fbp,
      fbc,
      formType,
      page_url
    } = body;

    const { ip, userAgent } = extractClientInfo(request);

    await trackingService.trackFunnelEvent(
      'form_submitted',
      {
        email,
        phone,
        firstName,
        lastName,
        city,
        state,
        country,
        zipCode,
        ip,
        userAgent,
        fbp,
        fbc
      },
      {
        form_type: formType,
        page_url
      },
      clientId
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Form submit tracking error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}