import React from 'react'
import ModuleOverview from './_components/ModuleOverview'
import TutorInfo from './_components/TutorInfo'
import ModuleCards from './_components/ModuleCards'
import FreeSection from './_components/FreeSection'
import FAQs from './_components/FAQs'
import ModelHero from './_components/ModelHero'
import Overview from './_components/Overview'
import CoursePromoSection from './_components/CoursePromoSection'
import { WebCourse } from '@/payload-types'

const View2 = ({ course }: { course: WebCourse }) => {

    return (
        <div>
            <ModelHero title={course.title} image={course.image} />
            <ModuleOverview learningOutcomes={course.learningOutcomes} />
            <TutorInfo instructor={course.instructor} title={course.title} />
            <Overview />
            <ModuleCards title={course.title} subTitle={course.subTitle} image={course.image} learningOutcomes={course.learningOutcomes} />
            <FreeSection />
            <FAQs faqData={course.FAQs} />
            <CoursePromoSection />
        </div>
    )
}

export default View2
