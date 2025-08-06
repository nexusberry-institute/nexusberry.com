import React from 'react'
import CollaboratCard from './CollaborateCard'
import Instructor from './Instructor'
import CourseOutline from './CourseOutline'
import { getCourseModules } from '@/lib/getCourseModules'
import { getInstructors } from '@/lib/getInstructors'
import RenderRichText from './RenderRichText'

const CourseInfo = async ({
    slug,
    title,
    courseFormat,
    duration,
    instructor,
    projects,
    totalLectures,
    learningOutcomes,
    description,
    modules
}: any) => {
    const modulesData = await getCourseModules(slug);
    const instructors = await getInstructors();

    return (
        <section className="container mx-auto flex padding-x padding-y max-md:px-0 max-md:mt-5 gap-8 max-lg:flex-col-reverse">
            <div className="lg:w-[67%] space-y-10 max-md:space-y-6">
                <RenderRichText richText={learningOutcomes} />
                <RenderRichText richText={description} />

                {modulesData?.length > 0 && (
                    <div className="space-y-4 max-md:px-3">
                        <h2 className="font-semibold text-2xl max-sm:text-xl">Course Outline</h2>
                        <CourseOutline modules={modulesData || []} />
                    </div>
                )}


                <div className="space-y-4 max-md:px-3">
                    <h2 className="font-semibold text-2xl max-sm:text-xl">Instructor</h2>
                    {instructors.map((instructor: any) => (
                        <Instructor key={instructor.id} instructors={instructor} />
                    ))}
                </div>
            </div>

            <div className="lg:w-[33%] lg:sticky top-24 h-fit">
                <CollaboratCard
                    title={title}
                    courseFormat={courseFormat}
                    duration={duration}
                    instructorName={instructor?.name || "nexusberry"}
                    projects={projects}
                    totalLectures={totalLectures}
                />
            </div>
        </section>
    );
}

export default CourseInfo;
