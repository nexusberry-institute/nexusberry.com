import Image from 'next/image'
import React from 'react'
import RichText from '@/components/RichText'
import { placeholderImg } from '@/app/(frontend)/(website)/_assets/images'
import { Event, Media } from '@/payload-types'



export default function CourseDetail({ learningOutcomes, image }: { learningOutcomes: Exclude<Event["learningOutcomes"], undefined | null>, image: Media | null | undefined }) {
  return (
    <div className='grid grid-cols-2 mx-10 mt-20 max-lg:grid-cols-1 max-sm:mt-8'>
      <div>
        {/* <h1 className='font-bold text-4xl max-lg:text-center max-xs:text-2xl mb-8'>What you will Learn?</h1> */}
        <div className='list-disc [&_ul]:list-disc [&_ul]:ml-[0px] md:[&_ul]:ml-[18px] [&_ul]:mt-0  [&_li]:mb-2 [&_li]:text-lg'>
          <RichText data={learningOutcomes} className='min-w-full p-0 m-0 ' />
        </div>


      </div>
      <div className='max-lg:hidden'>
        <div className='w-[80%] aspect-[258/245] relative bg-primary-50 border-[30px] rounded-2xl border-primary-50 float-end'>
          <Image
            src={image?.url ?? placeholderImg}
            alt={image?.alt ?? "NexusBerry Event image"}
            fill
            className="object-cover rounded-2xl"
            sizes="(max-1280px),192px,420px"
          />
        </div>
      </div>
      {/* <div className='max-lg:hidden'>
        <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden border-4 border-primary-50 bg-primary-50 shadow-lg mx-auto">
          <Image
            src={image?.url ?? placeholderImg}
            alt={image?.alt ?? "NexusBerry Event image"}
            fill
            className="object-cover"
          // sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

      </div> */}
    </div>
  )
}
