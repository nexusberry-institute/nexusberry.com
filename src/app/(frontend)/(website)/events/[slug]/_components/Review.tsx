
import Link from 'next/link';

export default function Review({ title, slug }: { title: string, slug: string }) {
  return (
    <div className="text-center text-gray-700 mb-6 max-lg:text-justify px-2">
      <p>
        If you have already registered for the <span className="font-semibold">{title}</span> event and attended the session,
        please take a moment to share your feedback.
      </p>
      <p className="mt-2">
        <Link
          href={`/events/${slug}/review`}
          aria-label="Go to the review page"
          className="text-primary-400 underline hover:text-primary-500"
        >
          Click here
        </Link> to submit your review and download your certificate.
      </p>
    </div>
  );
}
