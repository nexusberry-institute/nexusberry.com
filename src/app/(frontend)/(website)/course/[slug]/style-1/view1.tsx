import Link from "next/link"
import { Button } from "@/components/ui/button"
import Hero from "./_component/HeroSection/Hero"
import Offer from "./_component/Offer"
import RegistrationForm from "./_component/RegistrationForm"
import CourseInfo from "./_component/CourseInfo"
import { WebCourse } from "@/payload-types"

const View1 = ({ course }: { course: WebCourse }) => {
  const {
    title, image, courseFormat, difficultyLevel,
    duration, instructor, projects, learningOutcomes,
    totalLectures, description, modules, slug
  } = course

  return (
    <div>
      <Hero
        title={title}
        image={image}
        courseFormat={courseFormat}
        difficultyLevel={difficultyLevel}
        duration={duration}
        instructorName={typeof instructor === "object" ? instructor?.name : "NexusBerry"} />

      {/* What You'll Learn, Course Description, Course Outline, Instructor, Right Sidebar */}
      <CourseInfo
        slug={course.slug}
        title={title}
        courseFormat={courseFormat}
        duration={duration}
        instructor={instructor}
        projects={projects || ""}
        totalLectures={totalLectures || ""}
        learningOutcomes={learningOutcomes}
        description={description}
        modules={modules}
      />

      {/* Full width Single Banner */}
      <div className="max-md:mx-5 md:px-10">
        <Offer />
      </div>

      {/* Book Free Demo form */}
      <section id="registration-form" className="bg-primary-600 padding-x max-sm:px-4">
        <div className="flex container max-lg:flex-col mx-auto pt-28 max-sm:pt-16 text-background space-y-4">
          <div className="space-y-4 max-lg:text-center ">
            <h3 className="text-4xl font-bold max-lg:text-3xl max-lg:font-semibold max-sm:taxt-xl " >
              Book Free Demo
            </h3>
            <p className="text-xl max-sm:text-base text-left">
              Engage in an informative demo session for our training course, providing you with a glimpse into NexusBerry&#39;s offerings. Get answers to your questions and make an informed decision.
            </p>
          </div>
          <RegistrationForm
            slug={slug}
            redirect={true}
          />
        </div>
      </section>
      <div className="bg-card p-4 lg:hidden w-full fixed bottom-0">
        <Link href="#registration-form">
          <Button className='w-full text-lg max-sm:text-base py-7 max-sm:py-6 rounded-xl bg-secondary hover:bg-secondary-400'>
            Book Free Demo
          </Button></Link>
      </div>
    </div>
  )
}

export default View1
