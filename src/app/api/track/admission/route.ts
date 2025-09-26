// app/api/track/admission/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { trackingService } from '@/lib/marketing/tracking-service';
import { extractClientInfo } from '@/lib/marketing/tracking-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      admissionType,
      value,
      currency,
      clientId,
      fbp,
      fbc,
      page_url
    } = body;

    const { ip, userAgent } = extractClientInfo(request);

    await trackingService.trackFunnelEvent(
      'admission',
      {
        email,
        ip,
        userAgent,
        fbp,
        fbc
      },
      {
        admission_type: admissionType,
        value: value,
        currency: currency || 'USD',
        page_url
      },
      clientId
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admission tracking error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}