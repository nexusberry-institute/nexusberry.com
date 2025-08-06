'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import usericon from '../../_assets/images/user-icon.webp'

export const AlumniBox = () => [
    {
        id: 0,
        review: 'Found the best training at WsCube Tech. I have also done my SEO course from here and was highly satisfied. I wanted to become a full-stack digital marketer and then chose this online advertising course. Again, I am so glad that I made the right decision in this course.',
        name: 'Barkha Singh'
    },
    {
        id: 1,
        review: 'I am so much thankful to WsCube Tech for this course. We are 18 people in our batch, and it was so easy to engage with the mentor. We could ask all our questions and doubts without worrying. The best part is that it also covers the Hotstar ads course which was an eye-opener and exciting thing for me.',
        name: 'Ankit Sharma'
    },
    {
        id: 2,
        review: 'I am so much thankful to WsCube Tech for this course. We are 18 people in our batch, and it was so easy to engage with the mentor. We could ask all our questions and doubts without worrying. The best part is that it also covers the Hotstar ads course which was an eye-opener and exciting thing for me.',
        name: 'Sohail Anan'
    },
    {
        id: 3,
        review: 'An amazing course and a wonderful instructor. Covers everything from the basic level and then takes to the advanced concepts of advertising. Our mentor was highly proficient in running different types of ads on all platforms. Highly recommend it!',
        name: 'Paripekhya Dixit'
    }
]

const Alumni = () => {
    const [isExpanded, setIsExpanded] = useState<number[]>([])

    const toggleExpand = (id: number) => {
        setIsExpanded(prev =>
            prev.includes(id)
                ? prev.filter(itemId => itemId !== id)
                : [...prev, id]
        )
    }
    return (
        <div className='container mx-auto mt-20 py-4 px-4 lg:px-40 text-foreground'>
            <div className="animate-slide-ltr text-center lg:text-start my-4">
                <div className=' flex flex-col lg:flex-row justify-center lg:justify-start items-center gap-4'>
                    <div className='flex gap-2'>
                        {Array(4).fill(0).map((_, i) => (
                            <Image src="https://deen3evddmddt.cloudfront.net/images/icons/fill-star-icon.svg" alt='star' width={40} height={40} key={i} />
                        ))}
                    </div>
                    <h2 className='text-[1rem] lg:text-lg text-foreground font-semibold'>
                        4.9 <span className='font-medium lg:font-semibold text-[14px] lg:text-[1rem]'>(919 Reviews)</span>
                    </h2>
                </div>
                <h1 className="text-xl mt-4 text-foreground font-semibold ">
                    Hear From Our Alumni
                </h1>
            </div>
            <div className='mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start items-start'>
                {
                    AlumniBox().map((item) => (
                        <div key={item.id} className="border border-r-4 border-b-4 border-foreground p-4 w-full  rounded-xl">
                            <p className={`${!isExpanded.includes(item.id) && 'line-clamp-5'} text-[14px] font-medium text-muted-foreground text-left`}>{item.review}</p>
                            <button
                                onClick={() => toggleExpand(item.id)}
                                className='text-primary-600 hover:text-primary-800 text-sm mt-2'
                            >
                                {isExpanded.includes(item.id) ? 'See Less' : 'See More'}
                            </button>
                            <div className="flex items-center justify-start gap-4 mt-4">
                                <Image src={usericon} alt='usericon' width={40} height={40} />
                                <h1 className='font-bold text-foreground'>{item.name}</h1>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Alumni