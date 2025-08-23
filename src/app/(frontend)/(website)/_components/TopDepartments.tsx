import React from 'react'
import { modulebg } from '../_assets/images'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { placeholderImg } from '../_assets/images'

import { queryDepartments } from './Header'
import ErrorCard from './ErrorCard'

export default async function TopDepartments() {
  try {
    const departments = await queryDepartments()

    if (!departments.length) {
      return (
        <div className="container mx-auto py-16 px-4">
          <div className="bg-card rounded-xl border border-border shadow-md p-8 max-w-2xl mx-auto text-center space-y-6">
            <div className="flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                <path d="M8 7h6"></path>
                <path d="M8 11h8"></path>
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
              No Courses Available
            </h1>
            <p className="text-muted-foreground">
              We&#39;re currently working on adding new courses to our catalog. Please check back soon!
            </p>
            <div className="pt-4">
              <Link
                href="/"
                className="rounded-md bg-primary px-6 py-3 text-card font-medium shadow-sm hover:bg-primary/90 transition-colors"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="bg-gradient-to-r from-primary-400 to-primary-800 bg-primary md:px-10">
        <div className="container col-span-2 md:col-span-3 lg:col-span-2 flex flex-col  justify-center gap-4 text-card max-lg:items-center mb-6 pt-8 px-5 md:px-0">
          <h1 className="font-semibold text-lg md:text-3xl leading-10 max-lg:text-center">
            Explore Leading Career Domains
          </h1>
          <p className=" lg:text-sm max-lg:text-center space-x-1 ">
            Uncover career paths tailored to your passion and goals. Explore{' '}
            <br className="max-lg:hidden" /> industry-focused mentorship programs designed to guide you toward success.
            <br />
            {/* <Link
              href="/departments"
              aria-label="go to the explore page under"
              className="underline font-semibold"
            >
              Browse All Courses
            </Link> */}

          </p>
          <Link
            href="/departments"
            aria-label="go to the explore page under"
            className="bg-primary w-fit   text-background py-2 px-4 rounded-xl mt-8 ring-2 ring-primary font-bold block hover:bg-background hover:text-primary-600"
          >
            Browse All Courses
          </Link>
        </div>
        <div
          className="container mx-auto grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4  px-5 md:px-0  py-10  space-y-1"
          style={{
            backgroundImage: `url(${modulebg.src})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        >

          {departments.map((department) => (
            <Link
              href={`/departments/${department.slug || ''}`}
              aria-label={department.title}
              key={department.title}
            >
              <div className="bg-background flex flex-col items-center  justify-center gap-4  rounded-2xl hover:-translate-y-2 duration-700 h-60 px-2 py-14">
                <div className="w-36 aspect-square relative">
                  <Image
                    src={typeof department.image === "object" ? department.image?.url || placeholderImg : placeholderImg}
                    alt={typeof department.image === "object" ? department.image?.alt || department.title : department.title}
                    fill
                    className="object-cover"
                    sizes="144px"
                  />
                </div>
                <h1 className="lg:text-[20px] font-semibold text-sm text-center ">
                  {department.title}
                </h1>
                <span
                  // href={`/department/${department.slug}`}
                  // aria-label={module.href}
                  className="text-primary-400 text-sm leading-[22px]"
                >
                  See Programs <ChevronRight className="inline" size={18} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )

  } catch (error) {
    return <ErrorCard error={error} />
  }

}
