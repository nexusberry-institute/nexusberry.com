import Link from 'next/link'
import type { Metadata } from 'next/types'
import { notFound } from 'next/navigation'
import { getTeacherWithBatchIds } from '../../../_lib/getTeacherWithBatchIds'
import TutorialTabs from '@/app/(frontend)/(website)/tutorials/[subject]/[tutorial]/_components/TutorialTabs'
import VideoPlayer from '@/app/(frontend)/(website)/tutorials/[subject]/[tutorial]/_components/VideoPlayer'
import RichText from '@/components/RichText'

type TutorialSubject = {
  id: number
  title: string
  slug: string | null
}

export async function generateMetadata({
  params: paramsPromise,
}: {
  params: Promise<{ subject: string; tutorial: string }>
}): Promise<Metadata> {
  try {
    const { tutorial: slug } = await paramsPromise
    return { title: `${slug} | Tutorials | Teacher Dashboard | NexusBerry` }
  } catch {
    return { title: 'Tutorial | Teacher Dashboard | NexusBerry' }
  }
}

export default async function TeacherTutorialDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ subject: string; tutorial: string }>
}) {
  const { tutorial: tutorialSlug } = await paramsPromise
  const { payload, teacher, batchIds } = await getTeacherWithBatchIds()

  if (!teacher || batchIds.length === 0) {
    notFound()
  }

  const result = await payload.find({
    collection: 'tutorials',
    overrideAccess: true,
    where: { slug: { equals: tutorialSlug } },
    depth: 2,
    limit: 1,
    select: {
      title: true,
      slug: true,
      subject: true,
      label: true,
      batches: true,
      showVideos: true,
      showQuiz: true,
      showAssignment: true,
      showCode: true,
      showPresentation: true,
      description: true,
      content: true,
      quiz: true,
      assignment: true,
      codeUrl: true,
      presentationUrl: true,
    },
  })

  const tutorial = result.docs[0]
  if (!tutorial) {
    notFound()
  }

  // Verify batch assignment: tutorial's batches must overlap with teacher's batches
  const tutorialBatchIds = (tutorial.batches as (number | { id: number })[] | null | undefined)
    ?.map((b) => (typeof b === 'object' && b !== null ? b.id : b))
    .filter(Boolean) as number[] | undefined

  if (!tutorialBatchIds || !tutorialBatchIds.some((id) => batchIds.includes(id))) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
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
            className="mx-auto text-red-400"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900">Not Assigned</h2>
          <p className="text-gray-500">
            You are not assigned to a batch that includes this tutorial.
          </p>
          <Link
            href="/teacher/tutorials"
            className="inline-block rounded-md bg-gray-900 px-6 py-2.5 text-sm text-white font-medium hover:bg-gray-800 transition-colors"
          >
            Back to Tutorials
          </Link>
        </div>
      </div>
    )
  }

  const subject =
    tutorial.subject && typeof tutorial.subject === 'object'
      ? (tutorial.subject as TutorialSubject)
      : null

  const subjectName = subject?.title || 'Unknown Subject'

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav>
        <ol className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <li>
            <Link
              href="/teacher/tutorials"
              className="hover:text-gray-900 transition-colors"
            >
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
            <span className="text-gray-500">{subjectName}</span>
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
          <li className="text-gray-900 font-medium">{tutorial.title}</li>
        </ol>
      </nav>

      {/* Title & Labels */}
      <div>
        {tutorial.label && (
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {tutorial.label
              .split(',')
              .map((l) => l.trim())
              .filter(Boolean)
              .map((badge) => (
                <span
                  key={badge}
                  className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full"
                >
                  {badge}
                </span>
              ))}
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{tutorial.title}</h1>
      </div>

      {/* Description */}
      {tutorial.description && (
        <section className="max-w-4xl">
          <RichText data={tutorial.description} enableGutter={false} />
        </section>
      )}

      {/* Video Section */}
      {tutorial.showVideos !== false && (
        <VideoPlayer slug={tutorialSlug} title={tutorial.title} tutorialId={String(tutorial.id)} />
      )}

      {/* Tabbed Content */}
      <TutorialTabs
        content={tutorial.content ?? null}
        quiz={typeof tutorial.quiz === 'object' ? tutorial.quiz : null}
        showQuiz={tutorial.showQuiz}
        assignment={tutorial.assignment ?? null}
        showAssignment={tutorial.showAssignment}
        codeUrl={tutorial.codeUrl ?? null}
        showCode={tutorial.showCode}
        presentationUrl={tutorial.presentationUrl ?? null}
        showPresentation={tutorial.showPresentation}
      />

      {/* Back Navigation */}
      <div className="border-t border-gray-200 pt-6">
        <Link
          href="/teacher/tutorials"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
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
          Back to Tutorials
        </Link>
      </div>
    </div>
  )
}
