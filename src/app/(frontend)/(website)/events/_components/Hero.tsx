import React from 'react'
import { eventsBanner } from '../../_assets/images'
import HeroCard from './HeroCard'
import { Event } from '@/payload-types'

export default function Hero({ eventData, attendee, learner }: {
  eventData: Event[], attendee: number, learner: number
}) {

  return (
    <div className='w-full shadowcss h-full bg-cover bg-center bg-no-repeat'
      style={{ backgroundImage: `url(${eventsBanner.src})`, backgroundSize: "cover" }}
    >
      <div className='container flex items-center justify-between px-2 py-10 relative lg:px-10 lg:gap-10 max-lg:justify-center max-lg:items-center mb-10 max-sm:mb-5'>
        <div className='space-y-8 z-10 text-center lg:text-start'>

          <h1 className='lg:text-[34px] text-[32px] max-sm:text-[20px] max-sm:leading-[30px] font-semibold  xl:leading-[48px] leading-[50px]'>
            NexusBerry <span className='text-primary-400 py-1 '>Exclusive Events: </span> Learn, Grow, <span className='max-xl:leading-[32px] block'>and Succeed!</span>
          </h1>

          <p className='leading-[30px] text-lg max-sm:text-sm'>
            Grow with expert-led training, insightful discussions, <br className='hidden xl:block' />
            and a strategic roadmap to your success—let your journey begin!!
          </p>

          <div className='flex gap-4  lg:gap-6 text-background max-lg:justify-center '>
            <div className='flex flex-col rounded-xl px-4 py-4 gap-1 justify-center items-center tracking-widest bg-primary-400'>
              <h2 className='font-semibold text-lg lg:text-2xl '>
                {attendee || 42521}
              </h2>
              <span className='text-xs'>Attendees Till Date</span>
            </div>

            <div className='flex flex-col py-4 px-4 rounded-xl xl:px-2 xl:py-4 gap-1 text-foreground justify-center items-center tracking-widest bg-secondary-300'>
              <h2 className='font-bold text-lg lg:text-2xl'>{learner || 42521}</h2>
              <span className='text-xs lg:text-sm'>Completed By Learner</span>
            </div>
          </div>
        </div>

        <HeroCard eventData={eventData} />

      </div>
    </div >
  )
}