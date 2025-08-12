import path from 'path'
import payload from 'payload'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        await payload.init({
            secret: process.env.PAYLOAD_SECRET || 'default_secret',
            mongoURL: process.env.DATABASE_URI || process.env.MONGO_URL!,
            local: true,
            config: path.resolve(process.cwd(), 'src/payload.config.ts'), // 👈 Explicit path
        })
        console.log('Secret exists:', Boolean(process.env.PAYLOAD_SECRET))
        const result = await payload.find({
            collection: 'students',
            limit: 0,
            depth: 0,
        })

        const names = result.docs
            .filter(s => typeof s.fullName === 'string' && s.fullName.trim())
            .map(s => `"${s.fullName?.replace(/"/g, '""')}"`)

        const csv = ['"Full Name"', ...names].join('\n')

        return new NextResponse(csv, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': 'attachment; filename="students_names.csv"',
            },
        })
    } catch (err: any) {
        return NextResponse.json(
            { error: 'Export failed', message: err.message },
            { status: 500 }
        )
    }
}
