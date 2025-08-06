import React from 'react'
import FeeCard from './_components/FeeCard'
import NextBatch from './_components/NextBatch'
import TimeSlot from './_components/TimeSlot'

const page = () => {
  return (
    <div className='p-4 mx-auto text-center space-y-8 max-md:space-y-6 max-sm:space-y-4'>
      <NextBatch />
      <TimeSlot />
      <h1 className='text-5xl max-lg:text-4xl max-xs:text-2xl max-md:text-3xl font-bold '>Installment Options Available</h1>
      <div className='grid grid-cols-3 max-lg:grid-cols-1 max-lg:w-full max-sm:gap-5 max-xs:gap-3 gap-10'>
        <FeeCard />
        <FeeCard />
        <FeeCard />
      </div>
    </div>
  )
}

export default page
