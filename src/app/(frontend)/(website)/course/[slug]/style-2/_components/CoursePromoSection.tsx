import { Button } from '@/components/ui/button'
import { ChevronsRight, Laptop } from 'lucide-react'
import { bgImg } from '@/app/(frontend)/(website)/_assets/images'
import React from 'react'
import Link from 'next/link'

const CoursePromoSection = () => {
  return (
    <div style={{
      backgroundImage: `url(${bgImg.src})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
      className='h-96 max-xs:h-fit lg:bg-fixed my-20 max-sm:my-10'>
      <div className='bg-foreground/70 bg-opacity-70 text-card padding-y padding-x max-sm:p-4 text-center space-y-8 font-semibold h-full'>
        <h1 className='text-5xl container max-lg:text-3xl max-md:text-2xl max-xs:font-semibold'>Learn More About Our Digital Marketing Certification Course</h1>
        <div className='space-y-2 text-2xl max-md:text-xl max-sm:text-lg'>
          <h2>For Professionals, Entrepreneurs & Job-Seekers</h2>
          <h3>(Become a Google & Facebook Certified Professional)</h3>
        </div>
        <div className='space-x-4 space-y-4 items-center mx-auto'>
          <Link href={'/enroll-now'}><Button className='p-6 text-lg font-semibold hover:bg-primary-400 shadow-[5px_5px_0px_hsl(var(--primary-400))] hover:shadow-[5px_5px_0px_hsl(var(--primary-500))]'>Enroll me now <ChevronsRight strokeWidth={4} /></Button></Link>
          <Button className='p-6 text-lg font-semibold hover:bg-primary-400 shadow-[5px_5px_0px_hsl(var(--primary-400))] hover:shadow-[5px_5px_0px_hsl(var(--primary-500))]'>Start with Trial Class <Laptop strokeWidth={3} /></Button>
        </div>
      </div>
    </div>
  )
}

export default CoursePromoSection
