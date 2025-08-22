'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { whtsppIcon } from '@/app/(frontend)/(website)/_assets/images'
import { Button } from '@/components/ui/button'
import { CountdownTimer } from '@/components/CountDownTimer'
import { EventModel } from './EventModel'
import { Instructor, Media } from '@/payload-types'

interface JoinUsProps {
  instructor: Instructor | undefined | null
  title: string
  startDateTime: string
  whatsappLink: string | null | undefined
  whatsappQrCode: number | Media | null | undefined
  slug: string | null | undefined
  eventId: number
}

export default function JoinUs({
  instructor,
  title,
  startDateTime,
  whatsappLink,
  whatsappQrCode,
  slug,
  eventId,
}: JoinUsProps) {
  const timeLeft = CountdownTimer({ date: startDateTime })
  const [isOpenModel, setIsOpenModel] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && slug) {
      const userDetails = localStorage.getItem(`${slug}-registration`)
      console.log('Fetched userDetails from localStorage for slug:', slug, userDetails)
      setIsRegistered(!!userDetails)
    }
  }, [slug])

  return (
    <section
      className="mx-10 my-20 max-sm:my-6 flex gap-4 max-xl:flex-col max-sm:mx-2"
      id="show_footer"
    >
      <div className="flex bg-secondary-100 w-[70%] gap-8 rounded-2xl max-xl:w-full max-lg:flex-col px-4">
        {/* Instructor Card */}
        <div className="relative flex items-end mx-auto">
          <div className="relative w-[200px] md:w-[307px] aspect-[128/150]">
            <Image
              src={
                typeof instructor?.profileImage === 'object'
                  ? instructor?.profileImage?.url ?? '/nexusberryLogo.png'
                  : '/nexusberryLogo.png'
              }
              alt={
                typeof instructor?.profileImage === 'object'
                  ? instructor?.profileImage?.alt ?? 'NexusBerry instructor'
                  : 'NexusBerry instructor'
              }
              fill
              className="object-cover"
              sizes="307px"
            />
            <div className="absolute -bottom-14 md:bottom-5 w-full">
              <div className="glassEffect rounded-full flex flex-col justify-center items-center py-2">
                <span>Mentored by</span>
                <h3 className="font-bold">{instructor?.name ?? 'NexusBerry'}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Event Info */}
        <div className="flex flex-col justify-end space-y-8 px-4 py-6">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold max-lg:text-center">
              Hurry up and mark your calendars!!
            </h2>
            <p className="max-lg:text-center text-sm">
              If you are passionate about building a career in {title}, this can be your chance!
            </p>

            {/* Countdown (desktop) */}
            <ul className="flex gap-4 max-lg:hidden">
              {[`${timeLeft.days} Day`, `${timeLeft.hours} Hours`, `${timeLeft.minutes} Minutes`, `${timeLeft.seconds} Seconds`].map(
                (slot, ind) => (
                  <li
                    key={ind}
                    className="text-nowrap px-4 bg-background py-2 rounded-full text-sm ring-1 ring-foreground"
                  >
                    {slot}
                  </li>
                )
              )}
            </ul>

            {/* Countdown (mobile) */}
            <div className="flex gap-5 text-2xl font-semibold lg:hidden max-sm:text-sm max-sm:gap-2 justify-center">
              <div className="flex flex-col gap-1 items-center">
                <div>{timeLeft.days}</div>
                <div className="text-sm font-semibold">Days</div>
              </div>
              <span>:</span>
              <div className="flex flex-col gap-1 items-center">
                <div>{timeLeft.hours}</div>
                <div className="text-sm font-semibold">Hours</div>
              </div>
              <span>:</span>
              <div className="flex flex-col gap-1 items-center">
                <div>{timeLeft.minutes}</div>
                <div className="text-sm font-semibold">Minutes</div>
              </div>
              <span>:</span>
              <div className="flex flex-col gap-1 items-center">
                <div>{timeLeft.seconds}</div>
                <div className="text-sm font-semibold">Seconds</div>
              </div>
            </div>
          </div>

          {/* Registration / Live stream button */}
          {isRegistered ? (
            <Button
              onClick={() => {
  if (slug) {
    window.open(`/events/${slug}/live-stream`, '_blank', 'noopener,noreferrer')
  }
}}
              className="bg-primary-400 w-fit max-lg:mx-auto hover:bg-primary-400 font-bold py-6 rounded-xl hover:shadow-[4px_3px_0px_rgba(181,20,36,0.9)] duration-300"
            >
              Visit Live Stream
            </Button>
          ) : (
            <Button
              onClick={() => setIsOpenModel(true)}
              disabled={startDateTime < new Date().toISOString()}
              className="bg-primary-400 w-fit max-lg:mx-auto hover:bg-primary-400 font-bold py-6 rounded-xl hover:shadow-[4px_3px_0px_rgba(181,20,36,0.9)] duration-300"
            >
              {startDateTime < new Date().toISOString()
                ? 'Registrations Closed'
                : 'Register for free!!'}
            </Button>
          )}
        </div>
      </div>

      {/* WhatsApp Card */}
      <div className="w-[30%] text-center space-y-4 bg-primary-100 rounded-2xl p-8 max-xl:w-full">
        <div className="w-[60px] aspect-[1/1] mx-auto relative">
          <Image
            src={whtsppIcon}
            fill
            alt="WhatsApp community"
            className="object-contain"
            sizes="60px"
          />
        </div>
        <p className="font-semibold w-1/2 text-center mx-auto text-[15px]">
          Join this event&apos;s WhatsApp Group
        </p>
        <div className="flex flex-col gap-2 py-4">
          <div className="w-40 aspect-[1/1] max-xl:hidden mx-auto relative rounded-lg ring-1 ring-green-400">
            <Image
              fill
              src={
                typeof whatsappQrCode === 'object'
                  ? whatsappQrCode?.url ?? '/placeholderImg.jpg'
                  : '/placeholderImg.jpg'
              }
              alt={
                typeof whatsappQrCode === 'object'
                  ? whatsappQrCode?.alt ?? 'whatsappQrCode'
                  : 'whatsappQrCode'
              }
              className="rounded-lg object-cover"
              sizes="160px"
            />
          </div>
          <Link
            href={whatsappLink ?? '#'}
            aria-label="whatsapp"
            className="text-primary-400 text-sm font-semibold text-nowrap text-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            Join from PC instead
          </Link>
        </div>
      </div>

      {/* Event Registration Modal */}
      {isOpenModel && <EventModel setIsOpenModel={setIsOpenModel} eventId={eventId} slug={slug} />}
    </section>
  )
}
