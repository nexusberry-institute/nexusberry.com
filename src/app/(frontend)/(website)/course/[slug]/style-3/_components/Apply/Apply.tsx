import Image from 'next/image'
import React from 'react'
import students from '../../_assets/images/students.webp'
import data from '../../_assets/images/data-analysts.webp'
import financial from '../../_assets/images/financial-analysts.webp'
import professionals from '../../_assets/images/professionals.webp'

export const ApplyBox = () => [
    {
        id: 0,
        imgUrl: students,
        title: "Students"
    },
    {
        id: 1,
        imgUrl: data,
        title: "Data Analyst"
    },
    {
        id: 2,
        imgUrl: financial,
        title: "Financial Analyst"
    },
    {
        id: 3,
        imgUrl: professionals,
        title: "Professional"
    },
    {
        id: 4,
        imgUrl: students,
        title: "Students"
    },
    {
        id: 5,
        imgUrl: data,
        title: "Data Analyst"
    },
    {
        id: 6,
        imgUrl: financial,
        title: "Financial Analyst"
    },
    {
        id: 7,
        imgUrl: professionals,
        title: "Professional"
    },
]

const Apply = () => {
    return (
        <div className="container mx-auto py-4 px-4 lg:px-10 mt-10">
            <div className='lg:flex gap-4 '>
                <div className="text-center lg:text-start  lg:w-[30%]">
                    <h1 className="animate-slide-ltr text-[2rem] [line-height: 48px] font-semibold px-4">
                        Who can apply for the course?
                    </h1>
                </div>
                <div className='lg:w-[70%]  overflow-hidden mt-10 lg:mt-0'>
                    <div className="animate-stream-rtl hover:[animation-play-state:paused] text-foreground flex gap-2 ">
                        {
                            ApplyBox().map((item) => (
                                <div key={item.id} className='animate-slide-btt border-2 border-foreground rounded-xl min-w-48 h-60 flex flex-col items-center px-2'>
                                    <Image src={item.imgUrl} alt='img' width={170} height={170} className='object-contain mt-2' />
                                    <h1 className='font-semibold mt-2 text-sm px-2'>{item.title}</h1>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className="text-muted-foreground flex gap-3 flex-col items-center lg:items-start mt-8">
                <p>Whether you are searching for the best Google Ads Course, Facebook Ads Course, Instagram Marketing Course, Quora Ads Course, MX Player Ads Course, or any other, WsCube Tech has got you covered.</p>
                <p><strong>In this online advertising course,</strong> you will become a master at running effective ad campaigns across all types of digital platforms.</p>
                <p>Google Ads and social media ads on Facebook and Instagram are the most popular nowadays. Startups, small and medium businesses (SMBs), large enterprises, as well as brands across all industries need skilled ads specialists.</p>
                <p>Moreover, there are specialists for specific platforms, but an impactful ads strategy covers multiple platforms like MX Player and Hotstar. By learning these skills with us, you will be on your way to becoming an all-rounder in online advertising.</p>
                <p>This online advertising course will help you not only <strong>find high-paying full-time jobs,</strong> but also land <strong> freelancing opportunities </strong> from national and international clients.</p>
            </div>
        </div>
    )
}

export default Apply