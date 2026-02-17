import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import Link from 'next/link'
import type { Metadata } from 'next/types'
import ErrorCard from '../../../_components/ErrorCard'
import RichText from '@/components/RichText'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export const dynamic = 'force-static'
export const revalidate = 600

type TutorialSubject = {
  id: number
  title: string
  slug: string | null
}

const extractYouTubeId = (url: string): string | null => {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
    /youtube\.com\/watch\?v=([^"&?\/\s]{11})/i,
    /youtu\.be\/([^"&?\/\s]{11})/i,
    /youtube\.com\/embed\/([^"&?\/\s]{11})/i,
    /youtube\.com\/v\/([^"&?\/\s]{11})/i,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) return match[1]
  }
  return null
}

const queryTutorialBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'tutorials',
        where: { slug: { equals: slug } },
        depth: 1,
        limit: 1,
      })
      return result.docs[0] || null
    },
    [`tutorial-${slug}`],
    { tags: ['tutorials'] },
  )()

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'tutorials',
    pagination: false,
    limit: 1000,
    depth: 1,
    select: { slug: true, subject: true },
  })

  return result.docs
    .filter((doc) => doc.slug && doc.subject && typeof doc.subject === 'object')
    .map((doc) => ({
      subject: (doc.subject as TutorialSubject).slug || String((doc.subject as TutorialSubject).id),
      tutorial: doc.slug!,
    }))
}

export async function generateMetadata({
  params: paramsPromise,
}: {
  params: Promise<{ subject: string; tutorial: string }>
}): Promise<Metadata> {
  const { tutorial: slug, subject: subjectSlug } = await paramsPromise
  const tutorial = await queryTutorialBySlug(slug)

  if (!tutorial) {
    return { title: 'Tutorial Not Found | NexusBerry' }
  }

  const subjectTitle =
    tutorial.subject && typeof tutorial.subject === 'object'
      ? (tutorial.subject as TutorialSubject).title
      : ''

  const title = `${tutorial.title} | ${subjectTitle} Tutorial | NexusBerry`
  const description = `Learn ${tutorial.title} in our ${subjectTitle} tutorial series at NexusBerry Training & Solutions.`

  return {
    title,
    description,
    keywords: [
      tutorial.title?.toLowerCase() || '',
      subjectTitle?.toLowerCase() || '',
      'tutorial',
      'guide',
      'nexusberry',
    ],
    alternates: {
      canonical: `${getServerSideURL()}/tutorials/${subjectSlug}/${tutorial.slug}`,
    },
    openGraph: mergeOpenGraph({
      title,
      description,
      url: `${getServerSideURL()}/tutorials/${subjectSlug}/${tutorial.slug}`,
    }),
  }
}

export default async function TutorialPage({
  params: paramsPromise,
}: {
  params: Promise<{ subject: string; tutorial: string }>
}) {
  try {
    const { subject: subjectSlug, tutorial: tutorialSlug } = await paramsPromise
    const tutorial = await queryTutorialBySlug(tutorialSlug)

    if (!tutorial) {
      return (
        <div className="container mx-auto py-16 px-4">
          <div className="bg-card rounded-xl border border-border shadow-md p-8 max-w-2xl mx-auto text-center space-y-6">
            <div className="flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
              Tutorial Not Found
            </h1>
            <p className="text-muted-foreground">
              We couldn&apos;t find the tutorial &quot;{tutorialSlug}&quot; you&apos;re looking for.
              It may have been removed or the URL might be incorrect.
            </p>
            <div className="pt-4">
              <Link
                href="/tutorials"
                className="rounded-md bg-primary px-6 py-3 text-card font-medium shadow-sm hover:bg-primary/90 transition-colors"
              >
                Browse All Tutorials
              </Link>
            </div>
          </div>
        </div>
      )
    }

    const subject =
      tutorial.subject && typeof tutorial.subject === 'object'
        ? (tutorial.subject as TutorialSubject)
        : null

    const subjectName = subject?.title || 'Unknown Subject'
    const subjectHref = `/tutorials/${subject?.slug || subjectSlug}`

    // Validate subject slug matches
    if (subject?.slug && subject.slug !== subjectSlug) {
      return (
        <div className="container mx-auto py-16 px-4">
          <div className="bg-card rounded-xl border border-border shadow-md p-8 max-w-2xl mx-auto text-center space-y-6">
            <div className="flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
              Tutorial Not Found
            </h1>
            <p className="text-muted-foreground">
              This tutorial doesn&apos;t belong to the subject &quot;{subjectSlug}&quot;.
            </p>
            <div className="pt-4">
              <Link
                href={`/tutorials/${subject.slug}/${tutorial.slug}`}
                className="rounded-md bg-primary px-6 py-3 text-card font-medium shadow-sm hover:bg-primary/90 transition-colors"
              >
                Go to Correct Page
              </Link>
            </div>
          </div>
        </div>
      )
    }

    // Determine video embed
    const youtubeId =
      tutorial.videoSource === 'youtube' && tutorial.youtubeUrl
        ? extractYouTubeId(tutorial.youtubeUrl)
        : null
    const bunnyId =
      tutorial.videoSource === 'bunny' && tutorial.bunnyVideoId ? tutorial.bunnyVideoId : null
    const hasVideo = !!youtubeId || !!bunnyId

    return (
      <div>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-800 to-primary-950 py-14 md:py-18">
          <div className="padding-x max-w-7xl mx-auto">
            <nav className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-primary-300 flex-wrap">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </li>
                <li>
                  <Link href="/tutorials" className="hover:text-white transition-colors">
                    Tutorials
                  </Link>
                </li>
                <li>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </li>
                <li>
                  <Link href={subjectHref} className="hover:text-white transition-colors">
                    {subjectName}
                  </Link>
                </li>
                <li>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </li>
                <li className="text-white font-medium">{tutorial.title}</li>
              </ol>
            </nav>

            <div className="flex items-center gap-3 mb-3">
              {tutorial.label && (
                <span className="inline-block bg-secondary-500/20 text-secondary-300 text-xs font-semibold px-3 py-1 rounded-full border border-secondary-500/30">
                  {tutorial.label}
                </span>
              )}
              <Link
                href={subjectHref}
                className="text-primary-300 text-sm font-medium hover:text-white transition-colors"
              >
                {subjectName}
              </Link>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {tutorial.title}
            </h1>
            <div className="w-16 h-1 bg-secondary-500 rounded-full" />
          </div>
        </section>

        {/* Video Section */}
        {hasVideo && (
          <section className="padding-x max-w-5xl mx-auto py-10 md:py-14">
            <div className="relative w-full overflow-hidden rounded-xl shadow-lg border border-border bg-black aspect-video">
              {youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title={tutorial.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              ) : bunnyId ? (
                <iframe
                  src={`https://iframe.mediadelivery.net/embed/348450/${bunnyId}`}
                  title={tutorial.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              ) : null}
            </div>
          </section>
        )}

        {/* Rich Text Content */}
        {tutorial.content && (
          <section className="padding-x max-w-4xl mx-auto pb-16 md:pb-20">
            <RichText data={tutorial.content} enableGutter={false} />
          </section>
        )}

        {/* Back Navigation */}
        <section className="padding-x max-w-4xl mx-auto pb-12">
          <div className="border-t border-border pt-8">
            <Link
              href={subjectHref}
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 font-medium transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              All {subjectName} Tutorials
            </Link>
          </div>
        </section>
      </div>
    )
  } catch (error) {
    return <ErrorCard error={error} />
  }
}
