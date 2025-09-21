'use client'
import Image from 'next/image'
import { format } from 'date-fns'
import { Check, Calendar, Clock } from 'lucide-react'
import { CountdownTimer } from '@/components/CountDownTimer'
import { Instructor } from '@/payload-types'

export default function JoinUs({
  instructor,
  startDateTime,
  endTime,
  title,
}: {
  instructor?: Instructor | number | null
  startDateTime: string
  endTime?: string | null
  title?: string | null
}) {
  const timeLeft = CountdownTimer({ date: startDateTime })

  return (
    <div className="container mx-auto">
      <div
        className="relative -top-16 flex gap-4 sm:gap-10 p-2 sm:p-6 rounded-2xl bg-secondary-100 m-10 max-lg:flex-col max-sm:m-2"
        style={{
          backgroundImage: "url('/test_bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-32  aspect-square bg-red-500 relative rounded-full">
            <Image
              src={
                typeof instructor === 'object' && typeof instructor?.profileImage === 'object'
                  ? (instructor.profileImage?.url ?? '/NexusBerry_favi.jpg')
                  : '/NexusBerry_favi.jpg'
              }
              alt="instructor"
              fill
              className="object-cover rounded-full"
              sizes="130px"
            />
          </div>
          <h1 className="font-semibold text-center">
            {typeof instructor === 'object' ? instructor?.name : 'NexusBerry'}
          </h1>
          <p className="text-sm text-center w-[200px]">{title}</p>
        </div>

        <div className="flex flex-col space-y-4 sm:space-y-8 px-2 sm:px-4  py-6 max-lg:items-center">
          <div className="flex gap-4 items-center bg-primary-100 p-4 rounded-xl w-fit">
            <div className="bg-green-500 rounded-full h-fit   w-fit p-1  ">
              <Check strokeWidth={4} size={16} className="stroke-card" />
            </div>
            <h2 className="font-semibold">You're in! Registration has been done!</h2>
          </div>
          <p className="text-2xl   font-semibold max-lg:text-center">
            If you are passionate about building a career in This can be your chance!
          </p>
          <div className="flex gap-4">
            <div className="flex  items-center gap-2 max-lg:justify-center">
              <Calendar size={18} className="inline" />
              <span>{format(new Date(startDateTime), 'MMMM dd, yyyy')}</span>
            </div>
            {startDateTime ? (
              <div className="flex  items-center gap-2 max-lg:justify-center">
                <Clock size={18} className="inline" />
                <span>
                  {format(new Date(startDateTime), 'h:mm a')}{' '}
                  {endTime ? `- ${format(new Date(endTime), 'h:mm a')}` : ''}
                </span>
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col justify-center space-y-6 max-lg:items-center">
          {/* Add to Google Calendar Card */}
          <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-xs mx-auto mb-2 flex flex-col items-center">
            <p className="text-center text-md font-medium mb-4">
              Add to your Google Calendar and never miss the event!
            </p>
            <button
              className="bg-[#1557FF] hover:bg-[#003ccd] text-white font-bold py-3 px-6 rounded-lg w-full flex items-center justify-center gap-2 mb-2"
              onClick={() => {
                const eventTitle = encodeURIComponent(title || 'Nexusberry Masterclass')
                const details = encodeURIComponent(
                  'Join the live Masterclass - upgrade your skills and shape your future.',
                )
                const location = encodeURIComponent('Online')
                const start = startDateTime
                  ? new Date(startDateTime)
                    .toISOString()
                    .replace(/[-:]|\.\d{3}/g, '')
                    .slice(0, 15)
                  : ''
                const end = endTime
                  ? new Date(endTime)
                    .toISOString()
                    .replace(/[-:]|\.\d{3}/g, '')
                    .slice(0, 15)
                  : ''
                const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&details=${details}&location=${location}&dates=${start}/${end}`
                window.open(calendarUrl, '_blank')
              }}
            >
              Add to Google Calendar
            </button>
            {/* Show Join Now if event has started */}
            {startDateTime && new Date(startDateTime) <= new Date() && (
              <a
                href={
                  typeof window !== 'undefined'
                    ? `/events/${typeof instructor === 'object' && instructor && 'slug' in instructor
                      ? instructor.slug
                      : ''
                    }/live-stream`
                    : '#'
                }
                className="bg-[#1557FF] hover:bg-[#003ccd] text-white font-bold py-3 px-6 rounded-lg w-full flex items-center justify-center gap-2 mt-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Now
              </a>
            )}
          </div>
          <h2 className="text-center text-2xl font-bold">Event start soon</h2>
          <div className="flex gap-4 text-sm font-semibold ">
            <div className="flex flex-col gap-1  items-center">
              <div>{timeLeft.days}</div>
              <div className="text-sm font-semibold">Days</div>
            </div>
            <div>:</div>
            <div className="flex flex-col gap-1 items-center">
              <div>{timeLeft.hours}</div>
              <div className="text-sm font-semibold">Hours</div>
            </div>
            <span>:</span>
            <div className="flex flex-col gap-1 items-center">
              <div>{timeLeft.minutes}</div>
              <div className="text-sm font-semibold">Minuts</div>
            </div>
            <span>:</span>
            <div className="flex flex-col gap-1 items-center">
              <div>{timeLeft.seconds}</div>
              <div className="text-sm font-semibold">seconds</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
