import Image from 'next/image'
import React from 'react'

export const PreparationBox = () => [
    {
        id: 0,
        imgUrl: "https://deen3evddmddt.cloudfront.net/images/courses-details/resume.svg",
        title: "Resume Revamp",
        desc: "Upgrade and polish resumes to make them stand out to potential employers."
    },
    {
        id: 1,
        imgUrl: "https://deen3evddmddt.cloudfront.net/images/courses-details/linkdinprofile.svg",
        title: "LinkedIn Optimization",
        desc: "Optimize LinkedIn profiles to improve visibility and networking opportunities.."
    },
    {
        id: 2,
        imgUrl: "https://deen3evddmddt.cloudfront.net/images/courses-details/portfolio.svg",
        title: "Portfolio Building",
        desc: "Develop & refine a professional portfolio to demonstrate skills & projects."
    },
    {
        id: 3,
        imgUrl: "https://deen3evddmddt.cloudfront.net/images/courses-details/git-repo.svg",
        title: "GitHub Mastery",
        desc: "Enhance GitHub profiles to showcase your projects and collaboration skills."
    },
    {
        id: 4,
        imgUrl: "https://deen3evddmddt.cloudfront.net/images/courses-details/internship.svg",
        title: "Pitch Perfect",
        desc: "Improve your verbal,communication and presentation skills."
    },
    {
        id: 5,
        imgUrl: "https://deen3evddmddt.cloudfront.net/images/courses-details/job-ready.svg",
        title: "Job Ready",
        desc: "Climb the ladder that leads you to your dream job."
    }
]

const Preparation = () => {
    return (
        <>
            <div className="container mx-auto  mt-20  py-4 px-4">
                <div className="animate-slide-btt text-center my-4">
                    <h1 className="text-[2rem] font-bold ">
                        Last Mile Prep
                    </h1>
                    <p className="text-[12px] lg:text-[14px] font-medium text-muted-foreground mt-2">
                        Comprehensive Career Support to Help You Shine.
                    </p>
                </div>
                <div className='flex flex-col lg:flex-row lg:flex-wrap justify-center mt-8 items-center gap-4 lg:gap-0'>
                    {
                        PreparationBox().map((item) => (
                            <div key={item.id} className="animate-slide-ltr lg:w-[24%] h-[300px] lg:h-[400px] bg-card border-2 cursor-pointer  rounded-xl border-background mb-2 lg:mb-4 p-3 lg:p-4 lg:ml-12">
                                <div className=" flex flex-col items-center justify-between text-center gap-3 lg:gap-6">
                                    <Image src={item.imgUrl} alt="img" width={270} height={270} className='w-48 h-48 lg:w-full lg:h-full' />
                                    <h1 className='text-foreground font-semibold text-lg lg:text-xl'>{item.title}</h1>
                                    <p className="text-muted-foreground text-sm lg:text-lg font-medium">{item.desc}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="items-center justify-center text-center mt-4">
                    <button className="bg-primary-500 p-4 rounded-xl text-card font-semibold items-start w-60 mt-4 hover:border-r-2 hover:border-b-2">Talk to Program Advisor</button>
                </div>
            </div>
        </>
    )
}

export default Preparation