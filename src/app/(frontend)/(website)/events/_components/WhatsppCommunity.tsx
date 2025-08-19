import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Media } from '@/payload-types'

export default function WhatsppCommunity({ whatsappLink, whatsappQrCode }: { whatsappLink: string, whatsappQrCode: Media | number }) {
  return (
    <div className='container mx-auto'>
      <div className="bgImg bg-green-100 flex justify-between  gap-20 mx-10 p-8 rounded-xl max-lg:mx-4 max-lg:p-4 mt-10 max-sm:mt-5">
        <div className="space-y-6">
          <div className="space-y-2 max-lg:text-center">
            <h2 className="font-semibold text-2xl">Join NexusBerry WhatsApp Community</h2>
            <p className="text-lg">to get regular updates on Masterclasses </p>
            <Link
              href={`${whatsappLink || "#"}`}
              aria-label="whatsapp community Link"
              className="text-primary-400 text-lg font-semibold text-nowrap hidden max-lg:block py-4">
              Join from PC instead
            </Link>
          </div>

          <div className="lg:flex w-full max-lg:text-center space-y-4">
            <div className='space-y-1'>
              <h2 className="font-semibold text-lg">Project-Based Approach</h2>
              <p className="text-sm max-lg:text-base">
                Practical and engaging learning can be achieved through a hands-on project.
              </p>
            </div>

            <div className='space-y-1'>
              <h2 className="font-semibold text-lg">Free Prep Material</h2>
              <p className="text-sm max-lg:text-base">
                Access additional study resources at no extra cost to prepare more effectively.
              </p>
            </div>

            <div className='space-y-1'>
              <h2 className="font-semibold text-lg">Expert Career Guidance</h2>
              <p className="text-sm max-lg:text-base">
                Get professional guidance on steering your career in the right direction and make
                well-informed choices.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-4 max-lg:hidden">
          <div className="w-full aspect-[1/1] relative rounded-lg ring-1 ring-green-400">
            <Image
              src={typeof whatsappQrCode === "object" ? whatsappQrCode.url || '/brokenImage.png' : '/brokenImage.png'}
              alt={typeof whatsappQrCode === "object" ? whatsappQrCode.alt || 'WhatsApp Qr Code' : 'WhatsApp Qr Code'}
              className="rounded-lg object-center object-cover aspect-auto" sizes='148px'
              fill loading='lazy'
            />
          </div>
          <Link
            href={whatsappLink || "#"}
            aria-label="whatsApp Community Link"
            target='_blank'
            className="text-primary-400 text-sm font-semibold text-nowrap"
          >
            Join from PC instead
          </Link>
        </div>
      </div>
    </div>
  )
}
