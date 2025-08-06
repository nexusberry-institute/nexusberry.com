import Image from 'next/image'
import React from 'react'
import img from '../../_assets/images/certificatecourse.webp'

const Certificate = () => {
    const certificateData= [
        {
          icon: "https://deen3evddmddt.cloudfront.net/images/icons/certificate-icons.svg",
          alt: "certified",
          title: "Industry-Recognized Certificate",
          description: "Earn a certificate valued by top companies.",
        },
        {
          icon: "https://deen3evddmddt.cloudfront.net/images/icons/job-market-icon.svg",
          alt: "job market",
          title: "Stand Out in Job Market",
          description: "Fortify Your Profile to Increase Credibility",
        },
      ]
  return (
    <div className='bg-gradient-to-r from-primary-400 to-primary-700 h-[999px] lg:h-[499px]'>
        <div className="container mx-auto mt-20 py-4 px-4 relative">
            <div className="animate-slide-rtl text-center lg:ml-40 lg:mt-4">
                <h1 className="text-[2rem] text-card px-4 font-semibold ">
                    Be in the spotlight by getting certified!
                </h1>
                <p className="text-[12px] lg:text-[14px] text-center font-medium px-4 text-card mt-3">
                    A detailed overview of the course, including key topics, objectives, and module sequence.
                </p>
            </div>
            <div className='lg:grid lg:grid-cols-3 mt-32 lg:gap-10 absolute lg:bg-primary-400 text-card lg:rounded-xl lg:h-[240px]'>
                <div className='animate-slide-ltr absolute -top-20 left-10 lg:-top-52 lg:left-4'>
                    <Image src={img} alt="certified" width={300} height={300} className="" />
                </div>
                <div className='animate-slide-ltr border p-4 lg:border-none border-muted-foreground rounded-xl flex w-full flex-col items-center lg:items-start mt-96 ml-4 lg:mt-12 lg:ml-96'>
                    <div className='rounded-full p-2'>
                        <Image src="https://deen3evddmddt.cloudfront.net/images/icons/certificate-icons.svg" alt="certified" width={40} height={40} className="" />
                    </div>
                    <div className="flex flex-col items-center justify-center lg:items-start lg:justify-start">
                        <h1 className="font-semibold text-lg">Industry-Recognized Certificate</h1>
                        <p className='text-sm font-medium mt-4'>Earn a certificate valued by top companies.</p>
                    </div>
                </div>
                <div className='animate-slide-ltr border lg:border-none border-muted-foreground rounded-xl  flex w-full flex-col items-center lg:items-start ml-4 lg:mt-12 lg:ml-96 p-4 mt-2'>
                    <div className='rounded-full p-2'>
                        <Image src="https://deen3evddmddt.cloudfront.net/images/icons/job-market-icon.svg" alt="certified" width={40} height={40} className="" />
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="font-semibold text-lg">Stand Out in Job Market</h1>
                        <p className='text-sm font-medium mt-4'>Fortify Your Profile to Increase Credibility</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Certificate