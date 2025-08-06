import { generateMetadata } from './[slug]/page'
import HeroSection from "./_components/HeroSection"
import TopDepartments from './_components/TopDepartments'
import Events from './_components/Events'
import ImpactSection from './_components/ImpactSection'
import { getImpactData } from '@/lib/getImpactData'
import CoursesCollection from './_components/CourseCollection'
import { getCoursesCollection } from "@/lib/getCoursesCollection";
import Location from './_components/Location'
// import { fetchDepartments } from '@/lib/fetchDepartments'

export default async function Page() {

  // const departments = await fetchDepartments()
  const data = await getImpactData();
  if (!data) return null;
  const collectionData = await getCoursesCollection();
  return (
    <>
      <HeroSection />
      <TopDepartments />
      <CoursesCollection section={collectionData} />
      <Events />
      <ImpactSection
        heading={data.heading}
        subheading={data.subheading ?? null}
        stats={data.stats ?? []}
        testimonials={data.testimonials ?? []}
      />
      <Location />


    </>
  )
}

export { generateMetadata }