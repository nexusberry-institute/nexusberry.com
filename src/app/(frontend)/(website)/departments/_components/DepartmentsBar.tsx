'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

export default function DepartmentsBar({ departments }: {
  departments: {
    id: number;
    title: string;
    slug?: string | null | undefined;
  }[]
}) {
  const [activeSection, setActiveSection] = useState('')
  const router = useRouter()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id
            setActiveSection(sectionId)
            const barElement = document.getElementById('bar' + sectionId)
            if (barElement) {
              barElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
              })
            }
            router.replace(`#${sectionId}`, { scroll: false })
          }
        })
      },
      {
        rootMargin: '-50% 0px -50% 0px',
      },
    )

    departments.forEach((department) => {
      const element = document.getElementById(department.slug || `department-${department.title}`)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [router, departments])

  const handleClick = (value: string) => {
    const element = document.getElementById(value)
    const elementRect = element?.getBoundingClientRect()
    const middleOfElement =
      (elementRect?.top || 0) + window.pageYOffset + 1 - window.innerHeight / 3

    window.scrollTo({
      top: middleOfElement,
      behavior: 'smooth',
    })
    router.replace(`#${value}`, { scroll: false })
  }

  return (
    <div className="overflow-x-auto sticky h-fit top-20 max-sm:top-14  z-40 bg-primary-100 ">
      <h1 className="text-3xl text-center p-2 w-full font-semibold sticky left-0 bg-primary-700 text-background leeading-[50px]">
        Browse All Courses
      </h1>
      <ul className="flex gap-2 px-1 justify-center items-center py-3 text-background w-[68rem]  mx-auto max-lg:justify-start">
        {departments.map((department, index) => (
          <li
            key={index}
            id={'bar' + department.slug}
            className={` text-nowrap rounded-xl py-1 px-2 font-semibold leading-[30px]  ${department.slug == activeSection ? 'bg-secondary ' : 'bg-primary-400'}`}
          >
            <Link
              scroll={false}
              onClick={() => handleClick(department.slug || `department-${department.title}`)}
              href={`#${department.slug}`}
              aria-label={`go to ${department.title}`}
              className='block px-2  py-1 text-sm font-semibold  '
            >
              {department.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
