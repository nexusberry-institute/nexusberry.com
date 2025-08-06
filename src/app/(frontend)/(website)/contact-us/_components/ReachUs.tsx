import React from 'react'
import ReachUsCard from './ReachUsCard'
import { MapPin, MessageCircleMore, Phone } from 'lucide-react'

const ReachUs = () => {
  const cardData = [
    {
      icon: <Phone strokeWidth={1} className='bg-primary-400 fill-card p-2 size-12 stroke-inherit rounded-full'/>,
      title: 'Call Us',
      details: ['Landline: 021-34990066'],
    },
    {
      icon: <MessageCircleMore strokeWidth={2} className='bg-green-600 fill-green-600 p-2 size-12 stroke-card rounded-full'/>,
      title: 'Whatsapp',
      details: ['Number: 0314-8860546', 'Hours (11am – 6pm)'],
    },
    {
      icon: <MapPin strokeWidth={1} className='bg-primary-400 fill-card p-2 size-12 stroke-primary-400 rounded-full'/>,
      title: 'Visit Us',
      details: ['A316 Block 2 Gulshan-e-Iqbal Behind Rab Medical Center Karachi'],
    }
  ]

  return (
    <div className='space-y-3 max-md:space-y-2 max-md:text-center'>
      <label className='text-xl font-bold text-primary-400'>
        Ways To Reach Us
      </label>
      <h1 className='text-5xl max-md:text-2xl font-openSans font-bold'>We Would Love To Talk To You</h1>
      <p className='pb-8 max-md:pb-4 max-xs:pb-2 text-lg max-md:text-base font-montserrat'>Join our digital marketing institute and discover how we can have a conversation about boosting your success in the digital realm.</p>
      <ReachUsCard cardData={cardData}/>

    </div>
  )
}

export default ReachUs
