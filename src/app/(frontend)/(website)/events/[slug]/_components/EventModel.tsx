
import Image from 'next/image'
import { register } from '@/app/(frontend)/(website)/_assets/images'

import { X } from 'lucide-react'
import EventRegistrationForm from './EventRegistrationForm'

export function EventModel({ setIsOpenModel, eventId, slug, redirect = true }: {
  eventId: number,
  slug: string | null | undefined,
  redirect?: boolean, // Prevent Redirect When on Live Stream Page
  setIsOpenModel: React.Dispatch<React.SetStateAction<boolean>>,
}) {
  return (
    <>
      <div
        onClick={() => setIsOpenModel(false)}
        className="w-full h-full fixed top-0 left-0 z-30 flex justify-center items-center bg-foreground/80 transition-all duration-300"
      ></div>

      <div className="fixed w-[96%] sm:w-[65%] grid grid-cols-2 max-lg:grid-cols-1  gap-8  top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 z-50 bg-card h-fit rounded-xl p-4">
        <div className='space-y-6 bg-primary-400 p-8 rounded-xl max-lg:hidden'>

          <div>
            <Image src={register} alt="Register Now" sizes='400px' priority />
          </div>
          <p className='text-2xl font-bold text-center text-card'>Let&#39;s enable fun learning experiences, together</p>
        </div>
        <div className='relative'>
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-border">
            <h2 className="text-xl font-semibold">Register for Event</h2>
            <button
              onClick={() => setIsOpenModel(false)}
              className="p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="Close registration form"
            >
              <X size={18} />
            </button>
          </div>
          <EventRegistrationForm eventId={eventId} slug={slug} redirect={redirect} />
        </div>

      </div>
    </>
  )
}
