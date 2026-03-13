import type { Metadata } from 'next'
import HeroSection from "./_components/HeroSection"
import TopDepartments from './_components/TopDepartments'
import Events from './_components/Events'
import ImpactSection from './_components/ImpactSection'
import CoursesCollection from './_components/CourseCollection'
import Location from './_components/Location'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'
import { getCachedHomePage, getCachedDepartments, getCachedCoursesCollection } from '@/lib/getHomePage'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { ImpactSection as ImpactSectionType, Setting } from '@/payload-types'

export const revalidate = false

export default async function Page() {
  const [homePage, departments, collectionData, impactData, settings] =
    await Promise.all([
      getCachedHomePage(),
      getCachedDepartments(),
      getCachedCoursesCollection(),
      getCachedGlobal('impact-section', 2)() as Promise<ImpactSectionType>,
      getCachedGlobal('settings', 1)() as Promise<Setting>,
    ])

  return (
    <>
      <HeroSection hero={homePage.hero} />
      <TopDepartments
        config={homePage.departmentsSection}
        departments={departments}
      />
      {homePage.coursesSection?.enabled !== false && (
        <CoursesCollection section={collectionData} />
      )}
      {homePage.eventsSection?.enabled !== false && (
        <Events config={homePage.eventsSection} />
      )}
      <ImpactSection
        heading={impactData.heading}
        subheading={impactData.subheading ?? null}
        stats={impactData.stats ?? []}
        testimonials={impactData.testimonials ?? []}
      />
      {homePage.locationSection?.enabled !== false && (
        <Location settings={settings} />
      )}
    </>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const serverUrl = getServerSideURL()
  return {
    title: 'NexusBerry Training & Solutions',
    description:
      'Lahore-based IT training institute offering on-campus and online live courses across Pakistan.',
    keywords:
      'NexusBerry Training & Solutions, Online Learning Pakistan, IT Training Institute Lahore, NexusBerry Lahore Pakistan',
    alternates: { canonical: serverUrl },
    openGraph: mergeOpenGraph({
      title: 'NexusBerry Training & Solutions',
      description:
        'Lahore-based IT training institute offering on-campus and online live courses across Pakistan.',
      url: serverUrl,
    }),
  }
}
