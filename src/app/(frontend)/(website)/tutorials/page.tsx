import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import Link from 'next/link'
import type { Metadata } from 'next/types'
import ErrorCard from '../_components/ErrorCard'

export const revalidate = false

const queryTutorialsData = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })

    const [subjectsResult, tutorialsResult] = await Promise.all([
      payload.find({
        collection: 'tutorial-subjects',
        pagination: false,
        limit: 100,
        sort: 'position',
        select: { title: true, slug: true, position: true },
      }),
      payload.find({
        collection: 'tutorials',
        pagination: false,
        limit: 500,
        depth: 1,
        sort: 'position',
        select: { title: true, slug: true, position: true, subject: true, label: true },
      }),
    ])

    return {
      subjects: subjectsResult.docs,
      tutorials: tutorialsResult.docs,
    }
  },
  ['tutorials-listing'],
  { tags: ['tutorials-listing'] },
)

export default async function TutorialsPage() {
  try {
    const { subjects, tutorials } = await queryTutorialsData()

    // Group tutorials by subject ID
    type TutorialDoc = (typeof tutorials)[number]
    const tutorialsBySubject = new Map<number, TutorialDoc[]>()
    for (const tutorial of tutorials) {
      const subjectId =
        typeof tutorial.subject === 'object' && tutorial.subject !== null
          ? tutorial.subject.id
          : (tutorial.subject as number | null | undefined)

      if (subjectId) {
        const existing = tutorialsBySubject.get(subjectId) || []
        existing.push(tutorial)
        tutorialsBySubject.set(subjectId, existing)
      }
    }

    // Filter subjects that have tutorials
    const subjectsWithTutorials = subjects.filter((s) => tutorialsBySubject.has(s.id))

    const isEmpty = subjectsWithTutorials.length === 0

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
                <li className="text-white font-medium">Tutorials</li>
              </ol>
            </nav>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              NexusBerry Tutorials &amp; Guides
            </h1>
            <p className="text-primary-200 text-lg md:text-xl max-w-2xl mb-6">
              Structured lessons to help you master modern technologies step by step.
            </p>
            <div className="w-16 h-1 bg-secondary-500 rounded-full" />
          </div>
        </section>

        {/* Content */}
        {isEmpty ? (
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
                No Tutorials Available Yet
              </h2>
              <p className="text-muted-foreground">
                We&apos;re currently working on adding tutorials. Please check back soon!
              </p>
              <div className="pt-4">
                <Link
                  href="/"
                  className="rounded-md bg-primary px-6 py-3 text-card font-medium shadow-sm hover:bg-primary/90 transition-colors"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <section className="padding-x max-w-7xl mx-auto py-12 md:py-16">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-10">
              Browse by Subject
            </h2>

            <div className="space-y-12">
              {subjectsWithTutorials.map((subject) => {
                const subjectTutorials = tutorialsBySubject.get(subject.id) || []
                const subjectSlug = subject.slug || String(subject.id)

                return (
                  <div key={subject.id}>
                    {/* Subject Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl md:text-2xl font-semibold text-foreground">
                          {subject.title}
                        </h3>
                        <div className="hidden sm:block w-12 h-0.5 bg-secondary-500 rounded-full" />
                      </div>
                      <Link
                        href={`/tutorials/${subjectSlug}`}
                        className="text-sm font-medium text-primary-500 hover:text-primary-700 transition-colors flex items-center gap-1"
                      >
                        View All
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
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </Link>
                    </div>

                    {/* Tutorial Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {subjectTutorials.slice(0, 4).map((tutorial) => {
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
                  </div>
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

export const metadata: Metadata = {
  title: 'Tutorials & Guides | NexusBerry',
  description:
    'Browse free tutorials and guides on web development, JavaScript, and more. Structured lessons to help you master modern technologies step by step.',
  keywords: ['tutorials', 'guides', 'web development', 'javascript', 'nexusberry', 'learning'],
  openGraph: {
    title: 'Tutorials & Guides | NexusBerry',
    description:
      'Browse free tutorials and guides on web development, JavaScript, and more. Structured lessons to help you master modern technologies.',
  },
}
