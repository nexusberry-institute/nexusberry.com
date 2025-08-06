import React from 'react'
import Card from './Card'
import { Django } from '@/app/(frontend)/(website)/_assets/images'

const ModuleCards = ({ title, subTitle, image }: any) => {
    const cardData = [
        {
            id: 1,
            image: Django,
            title: "Module 1: Digital Marketing Overview",
            description: "Learn the foundation of digital marketing with complete understanding of digital marketing processes.",
            link: "/course-2/course2-module"
        },
        {
            id: 2,
            image: Django,
            title: "Module 2: Social Media Marketing",
            description: "Master social media platforms and create effective marketing strategies.",
            link: "/course-2/course2-module"
        },
        {
            id: 3,
            image: Django,
            title: "Module 3: SEO Fundamentals",
            description: "Understand search engine optimization techniques and improve website visibility.",
            link: "/course-2/course2-module"
        }
    ]
    return (
        <div className='bg-background my-10 max-lg:my-4'>
            <div className='container max-md:px-4 mx-auto text-center lg:space-y-3'>
                <h1 className='text-primary text-xl font-semibold pb-3 max-sm:pb-1'>We believe in transparency</h1>
                <h2 className='text-5xl max-md:text-3xl max-xs:text-xl max-sm:leading-5 font-bold'>Here&apos;s what you will learn in this Entire Course of 4 to 6 Months</h2>
                <div className='grid grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-xs:grid-cols-1 max-md:py-6 gap-8'>

                    <Card title={title} subTitle={subTitle} image={image} />

                </div>
            </div>
        </div>
    )
}

export default ModuleCards
