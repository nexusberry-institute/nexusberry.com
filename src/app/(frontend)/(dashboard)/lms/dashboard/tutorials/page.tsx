import Link from 'next/link'
import type { Metadata } from 'next/types'
import { getStudentWithBatchIds } from '../../_lib/getStudentEnrollment'

export const metadata: Metadata = {
  title: 'My Tutorials | NexusBerry LMS',
}

export default async function LmsTutorialsPage() {
  const { payload, student, batchIds } = await getStudentWithBatchIds()

  if (!student || batchIds.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">My Tutorials</h1>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center space-y-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto text-gray-400"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            <path d="M8 7h6" />
            <path d="M8 11h8" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900">No Tutorials Available</h2>
          <p className="text-gray-500">
            {!student
              ? 'Your student profile has not been set up yet. Please contact administration.'
              : 'You don\'t have any active enrollments with tutorials yet.'}
          </p>
        </div>
      </div>
    )
  }

  const [subjectsResult, tutorialsResult] = await Promise.all([
    payload.find({
      collection: 'tutorial-subjects',
      overrideAccess: true,
      pagination: false,
      limit: 100,
      sort: 'position',
      select: { title: true, slug: true, position: true },
    }),
    payload.find({
      collection: 'tutorials',
      overrideAccess: true,
      pagination: false,
      limit: 500,
      depth: 1,
      sort: 'position',
      where: { batches: { in: batchIds } },
      select: { title: true, slug: true, position: true, subject: true, label: true },
    }),
  ])

  const subjects = subjectsResult.docs
  const tutorials = tutorialsResult.docs

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

  const subjectsWithTutorials = subjects.filter((s) => tutorialsBySubject.has(s.id))

  if (subjectsWithTutorials.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">My Tutorials</h1>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center space-y-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto text-gray-400"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            <path d="M8 7h6" />
            <path d="M8 11h8" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900">No Tutorials Available</h2>
          <p className="text-gray-500">No tutorials are assigned to your batches yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">My Tutorials</h1>

      <div className="space-y-10">
        {subjectsWithTutorials.map((subject) => {
          const subjectTutorials = tutorialsBySubject.get(subject.id) || []
          const subjectSlug = subject.slug || String(subject.id)

          return (
            <div key={subject.id}>
              {/* Subject Header */}
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{subject.title}</h2>
                <div className="hidden sm:block w-10 h-0.5 bg-secondary-500 rounded-full" />
                <span className="text-sm text-gray-500">{subjectTutorials.length} tutorials</span>
              </div>

              {/* Tutorial Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {subjectTutorials.map((tutorial) => {
                  const tutorialSlug = tutorial.slug || String(tutorial.id)

                  return (
                    <Link
                      key={tutorial.id}
                      href={`/lms/dashboard/tutorials/${subjectSlug}/${tutorialSlug}`}
                      className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200"
                    >
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {tutorial.label &&
                          tutorial.label
                            .split(',')
                            .map((l) => l.trim())
                            .filter(Boolean)
                            .map((badge) => (
                              <span
                                key={badge}
                                className="inline-block bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full"
                              >
                                {badge}
                              </span>
                            ))}
                      </div>
                      <h3 className="text-base font-medium text-gray-900 line-clamp-2 mb-3">
                        {tutorial.title}
                      </h3>
                      <span className="text-sm text-blue-600 font-medium flex items-center gap-1">
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
    </div>
  )
}
