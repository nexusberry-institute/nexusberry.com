import React, { useMemo } from 'react'
import Image from 'next/image'
import { Clock } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'
import { placeholderImg } from '../../_assets/images'
import { Department } from '@/payload-types'

export default function CoursesCard({ departments }: { departments: Omit<Department, 'createdAt' | "updatedAt">[] }) {
  const sizes = useMemo(
    () => ({
      '2xl': { padding: 42, cols: 4, gap: 10 },
      xl: { padding: 10, cols: 4, gap: 10 },
      lg: { padding: 10, cols: 3, gap: 10 },
      md: { padding: 10, cols: 2, gap: 10 },
      sm: { padding: 6, cols: 2, gap: 6 },
      xs: { padding: 6, cols: 1, gap: 6 },
    }),
    [],
  )

  return (
    <div className="mb-10">
      {departments.map((department, ind) => (
        <div id={department.slug || `department-${department.title}`} key={ind}>
          <h1 className="text-3xl max-md:text-2xl  font-semibold px-8  py-4 leading-[50px] max-sm:px-4 mt-2 ">
            {department.title}
            <div className="w-20 max-md:w-16  h-1 bg-secondary  border-black"></div>
          </h1>
          <div className="grid grid-cols-4 px-8 py-4 max-md:py-2 gap-10 max-lg:grid-cols-3 max-md:grid-cols-2 max-xs:grid-cols-1 max-sm:px-2 max-sm:gap-6 mt-2">
            {!department.relatedCourses?.docs?.length ? (
              <div className="text-sm font-bold text-red-500">{`${department.title} courses coming soon!`}</div>
            ) : (
              department.relatedCourses.docs.map((course, index) => {
                if (typeof course !== "number") {
                  return (
                    <Link key={index} href={`/course/${course.slug}`}>
                      <Card className="w-full  hover:scale-105 mt-2 mx-auto rounded-none border-l-[6px] border-t-[2px]   border-r-[2px] border-b-[6px] border-black duration-1000">
                        <CardHeader className=" w-full aspect-square mx-auto border-black p-0 relative">
                          <Image
                            src={typeof course.image === "object" ? course.image?.url ?? placeholderImg : placeholderImg}
                            alt={typeof course.image === "object" ? course.image?.alt ?? course.title : course.title}
                            priority={ind === 0 && index <= 2}
                            fill
                            sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw,  50vw"
                            className="object-cover"
                          />

                          <span className="bg-secondary px-2 py-[2px] text-white absolute text-[12px] -right-2 md:-right-4 top-1">
                            {course.price ? `Rs: ${course.price}` : 'Free'}
                          </span>
                        </CardHeader>
                        <p className="ring-2 ring-black px-4 py-1 text-[14px] inline-block font-semibold text-white text-center relative left-1/2 -translate-x-1/2  rounded-xl  bg-secondary-500 -top-3 max-w-[300px] overflow-hidden text-ellipsis" style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          lineHeight: "1.25",
                          minHeight: "calc(1.25em * 2 + 0.6em)",
                        }}>
                          {course.title || 'please! include title'}
                        </p>
                        <CardContent className="p-0">
                          <div className="space-y-2 p-4  ">
                            <div className="font-bold text-sm line-clamp-2 leading-[1.25] min-h-[calc(1.25em*2+0.1em)]">
                              {course.subTitle || 'please! inlude description '}
                            </div>
                            <p className=" text-sm line-clamp-2 leading-[1.25] min-h-[calc(1.25em*2+0.1em)]">
                              {course.subTitle || 'please! inludes description '}
                            </p>
                          </div>
                          <hr className="h-[2px] bg-black " />
                          <div className="flex justify-between  items-center p-2 md:p-4">
                            <div className="flex items-center gap-1 md:gap-2 text-[11px] md:text-[14px] ">
                              <Clock className="inline" size={18} />
                              <span>{course.duration || ''} week</span>
                            </div>
                            <span className="text-[11px] md:text-[14px] font-semibold">
                              {course.difficultyLevel || 'includes difficulty level'}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                }
              }))
            }
          </div>
        </div>
      ))}
    </div>
  )
}
