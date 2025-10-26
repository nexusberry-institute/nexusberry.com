'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useSearchParams } from "next/navigation"

// 1. inc pending
// 2. send custome event to GTM pending with tracking params

export default function GoRedirectPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const [targetUrl, setTargetUrl] = useState<string | null>(null);
    const [platform, setPlatform] = useState<string | null>(null);
    const [error, setError] = useState(false);

    const slug = params.slug as string

    useEffect(() => {
        async function fetchRedirect() {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/platform-redirects?where[slug][equals]=${slug}`,
                    { cache: 'no-store' }
                );
                const data = await res.json();
                const record = data?.docs?.[0];
                if (!record) {
                    setError(true);
                    return;
                }

                // Build final target URL with automatic UTM params
                const url = new URL(record.targetUrl);
                const utmSource = searchParams.get('utm_source') || 'nexusberry';
                const utmMedium = searchParams.get('utm_medium') || record.platform || 'social';
                const utmCampaign = searchParams.get('utm_campaign') || record.slug;

                url.searchParams.set('utm_source', utmSource);
                url.searchParams.set('utm_medium', utmMedium);
                url.searchParams.set('utm_campaign', utmCampaign);

                setPlatform(record.platform);
                setTargetUrl(url.toString());

                // Record a click count in Payload
                // await fetch(`/api/increment-clicks?slug=${slug}`, { method: 'POST' });

                // Delay for UX and prevent back navigation loops
                setTimeout(() => {
                    window.location.replace(url.toString());
                }, 1800);
            } catch (err) {
                console.error('Redirect fetch failed:', err);
                setError(true);
            }
        }

        fetchRedirect();
    }, [slug, searchParams]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
                <h1 className="text-2xl font-semibold text-red-600">⚠️ Redirect not found</h1>
                <p className="mt-3 text-gray-600">The link you followed may be broken or expired.</p>
                <a href="https://nexusberry.com" className="mt-4 text-blue-600 underline">
                    Go to NexusBerry Home
                </a>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-gray-50">
            <Image
                src="/logos/logo-blue.png" // coming from public folder
                alt="NexusBerry Logo"
                width={80}
                height={80}
                className="mb-4 animate-pulse"
            />
            <h1 className="text-xl font-semibold text-gray-800">
                Redirecting to {platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : 'destination'}…
            </h1>
            <p className="text-gray-500 mt-2">Please wait a moment</p>

            {/* Optional animated loader */}
            <div className="mt-6 w-12 h-12 border-4 border-gray-300 border-t-[#124582] rounded-full animate-spin"></div>

            {/* Fallback link */}
            {targetUrl && (
                <noscript>
                    <a href={targetUrl} className="mt-6 text-blue-600 underline">
                        Click here if not redirected
                    </a>
                </noscript>
            )}
        </div>
    );
}
