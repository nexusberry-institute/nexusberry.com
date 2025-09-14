import Link from 'next/link'
import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'


const queryDepartments = unstable_cache(async () => {
  const payload = await getPayload({ config })
  const departments = await payload.find({
    collection: "departments",
    limit: 250,
    pagination: false,
    select: {
      title: true,
      relatedCourses: true,
    },
    sort: "orderInDepartments",
    populate: {
      "web-courses": {
        title: true,
        slug: true,
      }
    }


  })
  return departments.docs;
}, [], {
  tags: ["departments", "courses"]
  // , revalidate: 60 
})



export default async function FooterResources() {
  try {
    const departments = await queryDepartments();
    if (!departments.length) {
      return <div />
    }
    return (
      <div className="space-y-6 hidden lg:block ">
        {departments.map((department, index) => (
          <div key={index} className="space-y-6">
            <h2 className="font-semibold ">{department.title}</h2>
            <ul className=" flex flex-wrap gap-4 items-center ">
              {!department.relatedCourses?.docs?.length ? <div className='text-sm font-bold text-red-500'>courses not include yet</div> :
                department.relatedCourses.docs.map((course, ind) => {
                  if (typeof course !== "number") {
                    return <li
                      key={ind}
                      className=" lg:text-[12px] pr-2 leading-[15px]   w-fit group  text-nowrap border-e-[1.5px] "
                    >
                      <Link href={`/course/${course.slug}`} aria-label={`go to ${course.slug}`} className=" ">
                        {course.title}
                      </Link>
                    </li>
                  }
                  else {
                    return null
                  }
                })}
            </ul>
            <span className="bg-primary-300 block h-[1px]" />
          </div>
        ))}
      </div>
    )
  } catch (error) {
    return <div className='font-bold text-2xl text-red-500 text-center'>{error instanceof Error ? error.message : String(error)}</div>
  }
}
