'use client'

import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from '@/components/ui/carousel'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import RichText from '@/components/RichText'

export default function CoursesCollection({ section }: { section: any[] }) {
    if (!section || section.length === 0) return null

    return (
        <>
            {section.map((item: any, idx: number) => {
                const {
                    title,
                    content,
                    contentPosition,
                    linkLabel,
                    linkUrl,
                    courseCard,
                } = item

                const isContentLeft = contentPosition === 'left' || !contentPosition

                return (
                    <div key={idx}>
                        {/* Title */}
                        <div className="relative container mx-auto mt-20 mb-6 px-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs md:text-2xl font-bold text-primary">{title}</span>
                                <Link
                                    href={linkUrl}
                                    className="text-[10px] md:text-base border border-primary rounded-xl px-4 py-2 font-semibold bg-primary text-white hover:bg-white hover:text-primary transition-colors duration-300"
                                >
                                    {linkLabel}
                                </Link>
                            </div>
                        </div>

                        {/* Container */}
                        <div className="container mx-auto bg-gray-100 mb-20 rounded-2xl overflow-hidden shadow-sm">
                            <div className="flex flex-col lg:flex-row min-h-[400px]">
                                {isContentLeft ? (
                                    <>
                                        {/* RichText on Left */}
                                        <div className="hidden lg:flex w-full lg:w-2/7 xl:w-1/4 p-6 flex-shrink-0">
                                            <div className="h-full overflow-y-auto">
                                                <RichText
                                                    data={content}
                                                    className='prose prose-sm max-w-none text-gray-700 leading-relaxed'
                                                />
                                            </div>
                                        </div>

                                        {/* Carousel on Right */}
                                        <div className="flex-1 min-w-0 p-6 relative">
                                            <CourseCarousel courseCard={courseCard} />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Carousel on Left */}
                                        <div className="flex-1 min-w-0 p-6 relative">
                                            <CourseCarousel courseCard={courseCard} />
                                        </div>

                                        {/* RichText on Right */}
                                        <div className="w-full lg:w-2/5 xl:w-1/3 p-6 flex-shrink-0">
                                            <div className="h-full overflow-y-auto">
                                                <RichText
                                                    data={content}
                                                    className='prose prose-sm max-w-none text-gray-700 leading-relaxed'
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}
        </>
    )
}

function CourseCarousel({ courseCard }: { courseCard: any[] }) {
    return (
        <div className="h-full flex items-center">
            <Carousel opts={{ align: 'start', loop: true }} className="w-full">
                <CarouselContent className="flex -ml-4">
                    {courseCard?.map((course: any) => (
                        <CarouselItem
                            key={course.id}
                            className="pl-4 basis-full md:basis-1/2 lg:basis-1/2 xl:basis-1/3"
                        >
                            <CourseCard course={course} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 size-10 rounded-full bg-white text-gray-500 border border-gray-300 hover:bg-primary hover:text-white hover:border-primary hover:shadow-lg transition cursor-pointer shadow-md">
                    <ChevronLeft className="h-5 w-5" />
                </CarouselPrevious>
                <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 size-10 rounded-full bg-white text-gray-500 border border-gray-300 hover:bg-primary hover:text-white hover:border-primary hover:shadow-lg transition cursor-pointer shadow-md">
                    <ChevronRight className="h-5 w-5" />
                </CarouselNext>
            </Carousel>
        </div>
    )
}

function CourseCard({ course }: { course: any }) {
    const bgImage = course?.image?.url

    return (
        <Link
            href={`/course/${course.slug}`}
            className="relative block rounded-xl shadow hover:shadow-md transition overflow-hidden group aspect-square"
        >
            {bgImage ? (
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src={bgImage}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600" />
            )}

            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />

            <div className="relative z-10 h-full flex flex-col">
                <div className="flex-1 p-2 flex items-center justify-center" />

                <div className="p-0">
                    <div className="bg-white p-4">
                        <h3 className="font-semibold text-gray-800 leading-tight overflow-hidden"
                            style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                lineHeight: '1.25',
                                minHeight: 'calc(1.25em * 2 + 0.6em)',
                            }}>
                            {course.title}
                        </h3>

                        <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
                            <div className="flex items-center gap-1">
                                <span>⏱️</span>
                                <span>{course?.duration || 12} week</span>
                            </div>
                            <span className="text-gray-800 font-medium">
                                {course?.difficultyLevel || 'Beginner'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}