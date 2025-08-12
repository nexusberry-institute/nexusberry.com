import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function CertificateThanksPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
            <div className="max-w-xl text-center">
                <CheckCircle className="h-20 w-20 mx-auto text-green-500 mb-6" />
                <h1 className="text-lg md:text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Certificate Request Submitted
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                    Thank you! We have received your request. Our team will review and send your certificate to the provided email shortly.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-primary hover:bg-primary text-white text-sm font-semibold py-3 px-6 rounded-lg transition duration-300"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    )
}
