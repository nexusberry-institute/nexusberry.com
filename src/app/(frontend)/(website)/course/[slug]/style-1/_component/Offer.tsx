import React from 'react'
import BgSvg from './BgSvg'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Offer() {
  return (
    <div className='container mx-auto grid grid-cols-3 max-lg:grid-cols-1 gap-20 bg-gradient-to-r from-primary to-secondary-400 mb-10 max-md:mt-8 rounded-xl'>
      <div className='space-y-8 col-span-2 flex  flex-col justify-center pl-12 max-lg:p-10 max-sm:text-center '>
        <p className='text-2xl max-md:text-xl font-bold text-background'>
          Get in touch with the NexusBerry team to schedule your Free Demo Session or learn more about our upcoming training batches
        </p>
        <Link href="#registration-form"><Button className='p-7 max-md:p-6 rounded-xl bg-card hover:bg-background text-foreground font-semibold max-md:font-medium text-lg w-fit max-sm:mx-auto'>Book Free Demo</Button></Link>
      </div>
      {/* <section className='flex justify-end -mx-8 max-lg:hidden'> */}
      <section className='flex justify-end  max-lg:hidden'>
        <BgSvg />
      </section>
    </div>
  )
}
