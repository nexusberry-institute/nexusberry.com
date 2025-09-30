import Link from 'next/link';
import { getSettings } from '@/lib/getSettings';

interface PageProps {
    params: Promise<{ slug: string }>
}

export const metadata = {
    robots: 'noindex, nofollow'
}


export default async function SuccessBookFreeDemoPage({ params }: PageProps) {
    const { slug } = await params
    const settings = await getSettings();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                {/* Success Icon */}
                <div className="mb-6">
                    <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-10 h-10 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>

                {/* Success Message */}
                <h1 className="text-sm md:text-3xl font-bold text-gray-900 mb-4">
                    🎉 Registration Successful!
                </h1>

                <p className="text-gray-600 mb-2">
                    Thank you for registering for
                </p>

                <p className="text-sm md:text-lg font-semibold text-primary mb-6">
                    {slug.replace(/-/g, ' ').toUpperCase()}
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-primary">
                        📱 You will receive a confirmation message on WhatsApp shortly with further details.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <Link
                        href={`/course/${slug}`}
                        className="block w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary transition-colors font-medium"
                    >
                        Back to Course Details
                    </Link>

                    <Link
                        href="/departments"
                        className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                        Browse More Courses
                    </Link>

                    <Link
                        href="/"
                        className="block w-full text-gray-500 py-2 px-4 hover:text-gray-700 transition-colors"
                    >
                        Go to Homepage
                    </Link>
                </div>

                {/* Additional Info for Contact */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        Need help? Contact us at{' '}
                        {settings?.contactEmail ? (
                            <a
                                href={`mailto:${settings.contactEmail}`}
                                className="text-primary hover:underline"
                            >
                                {settings.contactEmail}
                            </a>
                        ) : (
                            <a
                                href="mailto:info@nexusberry.com"
                                className="text-primary hover:underline"
                            >
                                info@nexusberry.com
                            </a>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}