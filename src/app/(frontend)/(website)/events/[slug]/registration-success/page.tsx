import Link from "next/link"
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import JoinUs from "./_components/JoinUs";
import Success from './_components/Success'
import ErrorCard from "../../../_components/ErrorCard";
import { Media } from "@/payload-types";
import WhatsppCommunity from "./_components/WhatsppCommunity";

const queryEventbySlug = async (slug: string) => {
  const payload = await getPayload({ config: configPromise })
  const response = await payload.find({
    collection: 'events',
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
      showInUI: {
        equals: true,
      },
    },
    select: {
      slug: true,
      instructor: true,
      startDateTime: true,
      endTime: true,
      title: true,
      whatsappLink: true,
      whatsappQrCode: true
    }
  })
  return response.docs[0] || undefined
}

export const metadata = {
  robots: 'noindex, nofollow'
}

export default async function RegistrationSuccessPage({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug = "" } = await params

    const event = await queryEventbySlug(slug)

    if (!event) {
      return <div className="container mx-auto py-16 px-4">
        <div className="bg-card rounded-xl border border-border shadow-md p-8 max-w-2xl mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
            Event Not Found
          </h1>
          <p className="text-muted-foreground">
            We couldn&#39;t find the event &#34;{slug}&#34; you&#39;re looking for. It may have been removed or the URL might be incorrect.
          </p>
          <div className="pt-4">
            <Link
              href="/events"
              className="rounded-md bg-primary px-6 py-3 text-card font-medium shadow-sm hover:bg-primary/90 transition-colors"
            >
              Browse All Events
            </Link>
          </div>
        </div>
      </div>
    }

    return (
      <>
        <Success slug={event.slug as string} eventId={event.id} />
        <JoinUs instructor={event.instructor} startDateTime={event.startDateTime} endTime={event.endTime} title={event.title} slug={event.slug as string} />
        <WhatsppCommunity
          whatsappLink={event.whatsappLink ?? null}
          whatsappQrCode={event.whatsappQrCode as Media | null}
        />
      </>
    )
  } catch (error) {
    return <ErrorCard error={error} />
  }
}