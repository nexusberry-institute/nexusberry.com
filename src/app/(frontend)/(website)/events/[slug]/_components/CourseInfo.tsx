'use client'
import React, { useState } from 'react'
import { placeholderImg } from '@/app/(frontend)/(website)/_assets/images'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EventModel } from './EventModel'
import { masterClassBenefits } from '@/app/(frontend)/(website)/_constants/data'


export default function CourseInfo({ eventId, slug, startDateTime }: { eventId: number, slug: string | null | undefined, startDateTime: string }) {
  const [isOPenModel, setIsOpenModel] = useState(false)
  return (
    <>
      {
        isOPenModel &&
        <EventModel setIsOpenModel={setIsOpenModel} eventId={eventId} slug={slug} />
      }
      <section className='bg-primary-50 mt-16'>
        <div className="container relative flex justify-end p-4 max-xl:hidden">
          <div className='absolute inset-0'>
            <div className="h-[calc(100vh-5rem)] left-0 top-4 sticky flex flex-col w-1/2 pl-16 justify-center space-y-4 max-xl:py-10 max-lg:px-2 max-xl:space-y-8">
              <h3 className="text-5xl font-semibold max-xs:text-2xl xl:leading-[4rem] leading-[4rem] max-sm:leading-[3rem]  ">Why Join NexusBerry <br />Masterclasses?</h3>
              <p className="xl:text-justify text-center text-sm  max-xl:w-[70%] max-xl:mx-auto">
                Engage in unique learning opportunities from industry leaders through simple, accessible
                sessions designed to empower your career. Learn through practical experiences that
                transform theory into real-world skills in just a few hours! Discover the joy of mastering
                new tools and concepts that could launch your next career leap!
              </p>
              <Link
                href="#"
                aria-label="register yourself"
                className="max-lg:mx-auto max-lg:w-1/2 max-sm:w-full pt-20"
              >
                <Button
                  disabled={startDateTime < new Date().toISOString()}
                  onClick={() => setIsOpenModel(true)}
                  className="bg-primary-400  w-fit hover:bg-primary-400 font-bold py-8 px-8 rounded-xl hover:shadow-[4px_4px_0px_rgba(181,20,36,0.9)] duration-300">
                  {startDateTime < new Date().toISOString() ? "Registerations Closed" : "Register for free!!"}
                </Button>
              </Link>
            </div>
          </div>
          <ul className="flex flex-col max-xl:flex-row gap-48 relative pt-[calc(50%-26rem)] pb-[calc(50%-30rem)] pr-16">
            {
              masterClassBenefits.map((masterClassBenefit, index) => (
                <li key={index} className=" sticky top-[calc(50%-9rem)] bg-card shadow-[5px_5px_0px_rgba(0,0,0,0.9)] max-w-100 rounded-[20px] p-9 hover:shadow-[5px_5px_0px_hex(#fffff)] space-y-2 ">
                  <div className="w-56 relative aspect-[178/115]" >
                    <Image fill src={masterClassBenefit?.img ?? placeholderImg} alt={masterClassBenefit.title} className="rounded-xl" sizes="217px" loading='lazy' />
                  </div>
                  <div className="space-y-2 pb-4">
                    <h2 className="text-[18px] font-semibold ">{masterClassBenefit.title}</h2>
                    <p className="text-sm ">
                      {masterClassBenefit.description}
                    </p>
                  </div>
                </li>
              ))
            }
          </ul >
        </div>
        <div className='container xl:hidden'>
          <div className="pl-16 mx-auto text-center py-10 max-lg:px-2 space-y-8 max-sm:space-y-4">
            <h3 className="font-semibold text-center text-[clamp(1.5rem,5vw,3rem)] leading-[clamp(2rem,6vw,4rem)]">Why Join NexusBerry Masterclasses?</h3>
            <p className="text-center text-sm w-[70%] mx-auto">
              Engage in unique learning opportunities from industry leaders through simple, accessible
              sessions designed to empower your career. Learn through practical experiences that
              transform theory into real-world skills in just a few hours! Discover the joy of mastering
              new tools and concepts that could launch your next career leap!
            </p>
            <Button onClick={() => setIsOpenModel(true)} className="bg-primary-400  w-fit hover:bg-primary-400 font-bold p-8 max-sm:p-4 max-sm:rounded-lg rounded-xl hover:shadow-[4px_4px_0px_rgba(181,20,36,0.9)] duration-300">
              Register for free!!
            </Button>
          </div>
          <ul className="flex flex-row gap-8 scrollbar-none overflow-auto px-8 pb-8">
            {
              masterClassBenefits.map((masterClassBenefit, index) => (
                <li key={index} className="bg-card shadow-[5px_5px_0px_rgba(0,0,0,0.9)] max-w-100 rounded-[20px] p-9 hover:shadow-none space-y-2 ">
                  <div className="w-56 relative aspect-[178/115]" >
                    <Image fill src={masterClassBenefit?.img ?? placeholderImg} alt={masterClassBenefit.title} className="rounded-xl" sizes="217px" loading='lazy' />
                  </div>
                  <div className="space-y-3 pb-4">
                    <h2 className="text-[18px] font-semibold ">{masterClassBenefit.title}</h2>
                    <p className="text-sm ">
                      {masterClassBenefit.description}
                    </p>
                  </div>
                </li>
              ))
            }
          </ul>
        </div>
      </section >
    </>
  )
}
