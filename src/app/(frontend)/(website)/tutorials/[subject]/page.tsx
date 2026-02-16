import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import Link from 'next/link'
import type { Metadata } from 'next/types'
import ErrorCard from '../../_components/ErrorCard'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export const dynamic = 'force-static'
export const revalidate = 600

const querySubjectBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'tutorial-subjects',
        where: { slug: { equals: slug } },
        limit: 1,
        select: { title: true, slug: true, position: true },
      })
      return result.docs[0] || null
    },
    [`tutorial-subject-${slug}`],
    { tags: ['tutorial-subjects'] },
  )()

const queryTutorialsBySubject = (subjectId: number) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'tutorials',
        where: { subject: { equals: subjectId } },
        sort: 'position',
        pagination: false,
        limit: 500,
        select: { title: true, slug: true, position: true, label: true },
      })
      return result.docs
    },
    [`tutorials-by-subject-${subjectId}`],
    { tags: ['tutorials'] },
  )()

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'tutorial-subjects',
    pagination: false,
    limit: 100,
    select: { slug: true },
  })
  return result.docs.map((doc) => ({ subject: doc.slug || String(doc.id) }))
}

export async function generateMetadata({
  params: paramsPromise,
}: {
  params: Promise<{ subject: string }>
}): Promise<Metadata> {
  const { subject: slug } = await paramsPromise

  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'tutorial-subjects',
    where: { slug: { equals: slug } },
    limit: 1,
    select: { title: true, slug: true },
  })
  const subject = result.docs[0]

  if (!subject) {
    return {
      title: 'Subject Not Found | NexusBerry',
    }
  }

  const title = `${subject.title} Tutorials | NexusBerry`
  const description = `Browse all ${subject.title} tutorials and guides at NexusBerry. Structured lessons to help you master ${subject.title} step by step.`

  return {
    title,
    description,
    keywords: [subject.title?.toLowerCase() || '', 'tutorials', 'guides', 'nexusberry', 'learning'],
    alternates: {
      canonical: `${getServerSideURL()}/tutorials/${subject.slug}`,
    },
    openGraph: mergeOpenGraph({
      title,
      description,
      url: `${getServerSideURL()}/tutorials/${subject.slug}`,
    }),
  }
}

export default async function TutorialSubjectPage({
  params: paramsPromise,
}: {
  params: Promise<{ subject: string }>
}) {
  try {
    const { subject: slug } = await paramsPromise
    const subject = await querySubjectBySlug(slug)

    if (!subject) {
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
              Subject Not Found
            </h1>
            <p className="text-muted-foreground">
              We couldn&apos;t find the subject &quot;{slug}&quot; you&apos;re looking for. It may
              have been removed or the URL might be incorrect.
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

    const tutorials = await queryTutorialsBySubject(subject.id)
    const subjectSlug = subject.slug || String(subject.id)

    return (
      <div>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-800 to-primary-950 py-16 md:py-20">
          <div className="padding-x max-w-7xl mx-auto">
            <nav className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-primary-300">
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
                <li className="text-white font-medium">{subject.title}</li>
              </ol>
            </nav>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {subject.title}
            </h1>
            <p className="text-primary-200 text-lg md:text-xl max-w-2xl mb-6">
              {tutorials.length > 0
                ? `${tutorials.length} tutorial${tutorials.length === 1 ? '' : 's'} available to help you master ${subject.title}.`
                : `Tutorials for ${subject.title} are coming soon.`}
            </p>
            <div className="w-16 h-1 bg-secondary-500 rounded-full" />
          </div>
        </section>

        {/* Content */}
        {tutorials.length === 0 ? (
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
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  <path d="M8 7h6" />
                  <path d="M8 11h8" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
                No {subject.title} Tutorials Yet
              </h2>
              <p className="text-muted-foreground">
                We&apos;re currently working on adding {subject.title} tutorials. Please check back
                soon!
              </p>
              <div className="pt-4">
                <Link
                  href="/tutorials"
                  className="rounded-md bg-primary px-6 py-3 text-card font-medium shadow-sm hover:bg-primary/90 transition-colors"
                >
                  Browse All Subjects
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <section className="padding-x max-w-7xl mx-auto py-12 md:py-16">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                All {subject.title} Tutorials
              </h2>
              <span className="inline-flex items-center justify-center bg-primary-50 text-primary-700 text-sm font-semibold px-3 py-0.5 rounded-full">
                {tutorials.length}
              </span>
            </div>
            <div className="w-12 h-0.5 bg-secondary-500 rounded-full mb-8" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tutorials.map((tutorial) => {
                const tutorialSlug = tutorial.slug || String(tutorial.id)

                return (
                  <Link
                    key={tutorial.id}
                    href={`/tutorials/${subjectSlug}/${tutorialSlug}`}
                    className="group bg-card border border-border rounded-lg p-4 hover:shadow-md hover:border-primary-300 transition-all duration-200"
                  >
                    {tutorial.label && (
                      <span className="inline-block bg-primary-50 text-primary-600 text-xs font-medium px-2.5 py-1 rounded-full mb-3">
                        {tutorial.label}
                      </span>
                    )}
                    <h4 className="text-base font-medium text-foreground line-clamp-2 mb-3">
                      {tutorial.title}
                    </h4>
                    <span className="text-sm text-primary-500 font-medium flex items-center gap-1">
                      Start learning
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </div>
    )
  } catch (error) {
    return <ErrorCard error={error} />
  }
}
