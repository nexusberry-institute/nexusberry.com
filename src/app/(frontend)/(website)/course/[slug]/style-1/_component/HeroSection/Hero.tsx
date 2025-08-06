import React from 'react'

import { Clock } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import HeroNavigation from './HeroNavigation'
import beginer from '@/app/(frontend)/(website)/_assets/images/beginer.svg'
import HeroBgTmg from '@/app/(frontend)/(website)/_assets/images/herobackImg.webp'
import Link from 'next/link'
// import logo from '@/app/(frontend)/(website)/_assets/logo/reverse-logo.png'
// import HeroVideo from './HeroVideo'

export default function Hero({ title, image, courseFormat, difficultyLevel, duration, instructorName }: any) {
  return (
    <div className="bg-primary">
      <div className='container mx-auto grid grid-cols-2 gap-8 padding-y px-2 md:px-15 max-lg:gap-5 max-lg:grid-cols-1'>
        <section className='order-1 hidden max-lg:block'>
          <HeroNavigation title={title} department="" />
        </section>
        <div className=" text-background space-y-8 max-lg:space-y-0 max-lg:order-3">
          <section className='max-lg:hidden'>
            <HeroNavigation title={title} department="" />
          </section>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-4 capitalize">
              <span className="ring-1 ring-background rounded-lg px-2 py-1 max-sm:text-sm">
                {courseFormat}</span>
              <span className="ring-1 ring-background rounded-lg px-2 py-1 flex gap-1 max-sm:text-sm  ">
                <Image src={beginer} alt='beginer' className='invert inline-block' />{difficultyLevel}</span>
              <span className="ring-1 ring-background rounded-lg px-2 py-1 max-sm:text-sm ">
                <Clock size={14} className="inline mr-1" /> {duration} Weaks </span>
            </div>

            <h1 className="pt-3 text-4xl max-lg:text-2xl font-bold">
              {title}
            </h1>

            <div>
              Instructor: <span className="font-bold">{instructorName || "NexusBerry"}</span>
            </div>
          </div>
          <Link href="#registration-form" className="block">
            <Button className="text-bold bg-card text-primary-950 hover:bg-background max-md:hidden text-xl p-9 rounded-xl">
              Book Free Demo
            </Button>
          </Link>
        </div>


        <div className="relative w-full max-w-sm mx-auto aspect-square overflow-hidden">
          <Image
            src={image?.url || '/placeHolders/placeholderImg.jpg'}
            fill
            // priority={true}
            loading="lazy"
            alt={image?.alt || "Poster of Course " + title}
            className="object-contain rounded-xl"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>
    </div>
  )
}
