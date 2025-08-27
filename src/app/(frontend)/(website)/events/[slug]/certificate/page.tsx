'use server'
import Image from 'next/image'
import logo from '@/app/(frontend)/(website)/_assets/logo/reverse-logo.png'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { GenerateCertificate } from './GenerateCertificate'
import eventCertificatePic from './eventCertificatePic.jpg'
import Link from 'next/link'
import ErrorCard from '../../../_components/ErrorCard'

const queryFeedbacks = async (slug: string) => {

  const payload = await getPayload({ config: configPromise })
  const feedback = await payload.find({
    collection: 'event-feedbacks',
    limit: 1,
    depth: 2,
    pagination: false,
    where: {
      'event.slug': {
        equals: slug,
      }

    },
  })
  return feedback.docs[0] || null
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const events = await payload.find({
    collection: 'events',
    limit: 100,
    depth: 2,
    select: {
      slug: true,
    },
  })
  const params = events.docs.map(({ slug }) => {
    return { slug }
  })
  return params
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params

    const eventFeedback = await queryFeedbacks(slug)

    if (!eventFeedback) {
      return (
        <div className="max-w-md mx-auto my-12 p-8 rounded-xl shadow-lg bg-card border border-border">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="rounded-full bg-muted/30 p-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold">No Feedback Found</h2>

            <p className="text-muted-foreground">
              You need to submit feedback for this event before you can access your certificate.
            </p>

            <div className="flex gap-4 pt-4">
              <Link
                href={`/events/${slug}/review`}
                className="bg-primary hover:bg-primary-400 text-background py-2 px-4 rounded-lg transition-colors font-medium"
              >
                Submit Feedback
              </Link>

              <Link
                href="/events"
                aria-label="go to the events page"
                className="border border-border hover:bg-muted/50 py-2 px-4 rounded-lg transition-colors font-medium"
              >
                Browse Events
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="bg-card lg:h-screen space-y-6 md:space-y-20 p-4">
        <div className="pt-10">
          <div className="w-72 rounded-lg mx-auto  aspect-[4/1] relative p-8 bg-primary">
            <Image src={logo} alt="logo" fill priority className="object-contain" sizes="288px" />
          </div>
        </div>

        <div className="flex w-[90%]  sm:w-[80%] mx-auto max-lg:flex-col gap-6 md:gap-20 items-center justify-center">
          <div className="relative sm:w-[500px] w-full aspect-[3/2] ">
            <Image src={eventCertificatePic} alt="certication" fill sizes="(max-width:640px,100vw),500px" />
          </div>
          <div className="bg-card flex flex-col justify-center gap-5 ">
            <h1 className="md:text-4xl text-xl font-bold">
              Congratulations! Your Certificate is generated.
            </h1>
            <div className="w-fit">
              {eventFeedback && (
                <GenerateCertificate
                  name={eventFeedback.lead instanceof Object ? eventFeedback.lead.name : "Nexusberry Student"}
                  title={eventFeedback.event instanceof Object ? eventFeedback.event.title : "Nexusberry Event"}
                />
              )}
            </div>
            <p>
              Download your certificate and share this on your Linkedin profile and dont forget to tag
              us.
            </p>
          </div>
        </div>
      </div>
    )

  } catch (error) {
    <ErrorCard error={error} />
  }
}