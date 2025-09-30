"use client";

import RegistrationForm from './RegistrationForm'

const DemoFormWrapper = ({ courseId, slug }: { courseId: number, slug: string }) => {

    return (
        <div className="flex container max-lg:flex-col mx-auto pt-28 max-sm:pt-16 text-background space-y-4" >
            <div className="space-y-4 max-lg:text-center ">
                <h3 className="text-4xl font-bold max-lg:text-3xl max-lg:font-semibold max-sm:taxt-xl " >
                    Book Free Demo
                </h3>
                <p className="text-xl max-sm:text-base text-left">
                    Engage in an informative demo session for our training course, providing you with a glimpse into NexusBerry&#39;s offerings. Get answers to your questions and make an informed decision.
                </p>
            </div>
            <RegistrationForm
                courseId={courseId}
                slug={slug}
            />
        </div>
    )
}

export default DemoFormWrapper