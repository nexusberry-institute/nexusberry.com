'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import {
    type CarouselApi,
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

const CoursesLogo = ({ courses }: any) => {

    const [api, setApi] = useState<CarouselApi>()

    useEffect(() => {
        if (!api) return

        const intervalId = setInterval(() => {
            api.scrollNext()
        }, 3000)

        return () => clearInterval(intervalId)
    }, [api])

    return (
        <div
            className='flex container pt-8 justify-center'
        >
            <Carousel
                setApi={setApi}
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent className=''>
                    {courses.map((course: any, index: number) => (
                        <CarouselItem key={index} className="sm:basis-1/5 lg:basis-1/10 max-sm:basis-1/4">
                            <div className='w-20'>
                                <div className='relative w-20 aspect-[334/209]'>
                                    <Image
                                        alt="courses"
                                        src={course.img}
                                        fill
                                        sizes=''
                                        className="object-cover"
                                    />
                                </div>
                                <h1 className='text-sm text-muted-foreground pt-2 text-center'>{course.name}</h1>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className='hidden bg-card' />
                <CarouselNext className='hidden bg-card' />
            </Carousel>
        </div>
    )
}

export default CoursesLogo
