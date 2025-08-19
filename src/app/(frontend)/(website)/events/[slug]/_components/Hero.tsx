"use client"
import React, { useState } from 'react'
import TimeSlote from './TimeSlote'
import { Button } from '@/components/ui/button'
import { Certificate, ourMentor } from '@/app/(frontend)/(website)/_assets/images'
import Image from 'next/image'
import { UserCheck } from 'lucide-react'
import { EventModel } from './EventModel'
import { Instructor } from '@/payload-types'

export default function Hero({ title, instructor, startDateTime, endTime, eventId, slug }: {
  title: string, instructor?: number | Instructor | null, startDateTime: string,
  endTime?: string | null, eventId: number, slug?: string | null
}) {

  const [isOPenModel, setIsOpenModel] = useState(false)

  return (
    <div className="p-8 bg-primary-700 grid grid-cols-2 max-lg:grid-cols-1  ">
      <div className="text-background space-y-8 max-sm:space-y-6">
        <h2 className="text-[1.6rem] leading-5 font-light max-lg:text-center">
          {/* {eventType ? `${eventType} - ` : ''} */}
          MASTERCLASS
        </h2>

        <div className="relative mx-auto w-fit flex flex-col gap-2 space-y-4 text-center lg:hidden">
          <div className="w-32 rounded-full bg-muted mx-auto  aspect-square overflow-hidden relative ">
            <Image
              src={typeof instructor === 'number' ? "/nexusberryLogo.png" : (typeof instructor?.profileImage === "object" ? instructor.profileImage.url ?? '/nexusberryLogo.png' : "/nexusberryLogo.png")}
              alt={typeof instructor === 'number' ? "Nexusberry Instructor" : (typeof instructor?.profileImage === "object" ? instructor.profileImage.alt ?? 'Nexusberry Instructor' : "Nexusberry Instructor")}
              className="object-cover"
              fill
              sizes="288px"
              priority />
          </div>

          <div>
            <h2 className="font-bold">
              {instructor && typeof instructor === "object" && instructor.name
                ? instructor.name
                : "Nexusberry Trainer"}
            </h2>
            <div>
              <span>
                {instructor && typeof instructor === "object" && instructor.experience
                  ? `${instructor.experience}+ Years of Professional Experience`
                  : "18+ Years of Professional Experience"}
              </span>
            </div>
          </div>
          <Image
            src={ourMentor}
            alt="our mentor"
            className="absolute top-0 -left-12"
            sizes="107px"
          />
        </div>

        <h1 className="font-semibold text-xl md:text-4xl max-lg:text-center ">
          {title}
        </h1>
        <TimeSlote startDateTime={startDateTime} endTime={endTime} />

        <div className="flex gap-4 max-lg:justify-center max-lg:flex-col max-lg:gap-6">
          <Button
            onClick={() => setIsOpenModel(true)}
            disabled={startDateTime < new Date().toISOString()}
            className="bg-primary-400 w-fit max-lg:mx-auto hover:bg-primary-400 font-bold py-6 rounded-xl hover:shado-1px-4px-0px-rgb hover:shadow-[4px_3px_0px_rgba(181,20,36,0.9)] duration-300">
            {startDateTime < new Date().toISOString() ? "Registerations Closed" : "Register for free!!"}
          </Button>
          <div className="flex gap-1 items-center max-lg:justify-center">
            <Image src={Certificate} alt="certificate" sizes="28px" />
            <span className="text-lg">Certificate Included</span>
          </div>
        </div>
        <div className="flex gap-4 items-center max-lg:justify-center">
          <UserCheck />
          <span className="text-lg">2,618 already registered</span>
        </div>
      </div>
      <div className="max-lg:hidden ">
        <div className="bg-background w-[70%] text-center rounded-xl  rounded-b-xl relative space-y-2 float-end">
          <div className=" w-full rounded-t-xl  bg-gradient-to-r from-background to-secondary-300">
            <div className="w-72  mx-auto aspect-[181/236]  relative  ">
              <Image
                src={typeof instructor === 'number' ? "/nexusberryLogo.png" : (typeof instructor?.profileImage === "object" ? instructor.profileImage.url ?? '/nexusberryLogo.png' : "/nexusberryLogo.png")}
                alt={typeof instructor === 'number' ? "Nexusberry Instructor" : (typeof instructor?.profileImage === "object" ? instructor.profileImage.alt ?? 'Nexusberry Instructor' : "Nexusberry Instructor")}
                className="object-contain mx-auto "
                fill
                sizes='96px'
                priority
              />
            </div>
          </div>
          <div className="px-20 pb-5 ">
            <h3 className="text-primary font-bold">
              {instructor && typeof instructor === "object" && instructor.name
                ? instructor.name
                : "Nexusberry Trainer"}
            </h3>
            <span className="pt-2 inline-block">
              ({instructor && typeof instructor === "object" && instructor.experience
                ? `${instructor.experience}+ Years of Professional Experience`
                : "18+ Years of Professional Experience"})
            </span>
          </div>
          <Image src={ourMentor} alt="our mentor" className="absolute top-8 left-4" priority sizes='107px' />
        </div>
      </div>
      {
        isOPenModel &&
        <EventModel setIsOpenModel={setIsOpenModel} eventId={eventId} slug={slug} />
      }
    </div>
  )
}
