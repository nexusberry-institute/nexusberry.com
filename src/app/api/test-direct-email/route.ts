// src/app/api/test-direct-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPayloadHMR } from '@payloadcms/next/utilities';
import config from '@/payload.config';

export async function GET(request: NextRequest) {
    try {
        const payload = await getPayloadHMR({ config });

        console.log('🧪 Testing direct email send...');

        const result = await payload.sendEmail({
            to: 'rana.ajmal@gmail.com',
            from: process.env.DEFAULT_EMAIL_ADDRESS || 'rana.ajmal@gmail.com',
            subject: 'Direct Test Email',
            html: '<h1>This is a direct test email</h1><p>If you receive this, email is working!</p>'
        });

        console.log('📧 Direct email result:', result);

        return NextResponse.json({
            success: true,
            result: result,
            message: 'Test email sent'
        });

    } catch (error) {
        console.error('❌ Direct email test failed:', error);
        return NextResponse.json({
            success: false,
            error: (error as Error).message
        }, { status: 500 });
    }
}