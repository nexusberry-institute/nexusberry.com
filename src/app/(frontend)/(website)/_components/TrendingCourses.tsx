// // app/components/sections/TrendingCoursesSection.tsx
// 'use client'

// import React from 'react'
// import Link from 'next/link'
// import Image from 'next/image'
// import { Clock } from 'lucide-react'
// import { Card, CardContent, CardHeader } from '@/components/ui/card'
// import { placeholderImg } from '../_assets/images'
// import { Department } from '@/payload-types'

// interface TrendingCoursesSectionProps {
//     departments: Omit<Department, 'createdAt' | 'updatedAt'>[];
// }

// export default function TrendingCourses({ departments }: TrendingCoursesSectionProps) {
//     const trendingCourses = departments
//         .flatMap((dep) => dep.relatedCourses?.docs || [])
//         .filter((c): c is Exclude<typeof c, number> => typeof c !== 'number')
//         .slice(0, 3) // Only top 3 courses

//     if (!trendingCourses.length) return null

//     return (
//         <section className="px-8 max-sm:px-4 py-8">
//             <h2 className="text-3xl font-bold mb-6">Top Trending Courses</h2>
//             <div className="grid grid-cols-3 gap-6 max-md:grid-cols-2 max-sm:grid-cols-1">
//                 {trendingCourses.map((course, idx) => (
//                     <Link key={idx} href={`/course/${course.slug}`}>
//                         <Card className="hover:scale-105 transition-transform duration-300 border-black">
//                             <CardHeader className="aspect-square relative p-0 border-b border-black">
//                                 <Image
//                                     src={typeof course.image === "object" ? course.image?.url ?? placeholderImg : placeholderImg}
//                                     alt={typeof course.image === "object" ? course.image?.alt ?? course.title : course.title}
//                                     fill
//                                     className="object-cover rounded-t-lg"
//                                     sizes="(min-width:1024px) 33vw, 50vw"
//                                 />
//                                 <span className="bg-secondary text-white px-2 py-1 text-xs absolute top-2 right-2 rounded">
//                                     {course.price ? `Rs: ${course.price}` : 'Free'}
//                                 </span>
//                             </CardHeader>
//                             <CardContent className="p-4 space-y-2">
//                                 <h3 className="font-semibold text-lg">{course.title}</h3>
//                                 <p className="text-sm text-muted-foreground line-clamp-2">{course.subTitle}</p>
//                                 <div className="flex justify-between text-sm pt-2 border-t border-muted">
//                                     <span className="flex items-center gap-1">
//                                         <Clock size={14} /> {course.duration || '-'} weeks
//                                     </span>
//                                     <span>{course.difficultyLevel || 'N/A'}</span>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     </Link>
//                 ))}
//             </div>
//         </section>
//     )
// }
