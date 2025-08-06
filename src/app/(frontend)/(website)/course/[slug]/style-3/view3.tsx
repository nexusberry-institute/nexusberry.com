// anas
import Hero from "./_components/HeroSection/Hero"
import CourseHighlights from "./_components/Highlights/CourseHighlights"
import Preparation from "./_components/preparation/Preparation"
import Syllabus from "./_components/Syllabus/Syllabus"
import Working from "./_components/Working/Working"
import FeeStructure from "./_components/FeeStructure/FeeStructure"
import Alumni from "./_components/Alumni/Alumni"
import Faq from "./_components/Faq/Faq"
import Certificate from "./_components/Certificate/Certificate"
import Apply from "./_components/Apply/Apply"
import Mentors from "./_components/Mentors/Mentors"
import Enroll from "./_components/Enroll/Enroll"
import { WebCourse } from "@/payload-types"


const View3 = ({ course }: { course: WebCourse }) => {

  return (
    <div className="bg-card">
      <section>
        <div>
          <Hero title={course.title} instructor={course.instructor} subTitle={course.subTitle} />
          <Apply />
          <CourseHighlights title={course.title} />
          <Working title={course.title} />
          <Syllabus title={course.title} duration={course.duration} projects={course.projects} totalLectures={course.totalLectures} modules={course.modules} />
          <Preparation />
          <Certificate />
          <FeeStructure crossPrice={course.crossPrice} price={course.price} />
          <Mentors instructor={course.instructor} />
          <Enroll />
          <Alumni />
          <Faq faq={course.FAQs} title={course.title} />
        </div>
      </section>
    </div>
  )
}

export default View3