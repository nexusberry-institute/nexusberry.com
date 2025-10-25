import React from 'react'

const NextBatch = () => {
  return (
    <div className='space-y-4 container py-4'>
      <legend className='text-lg text-primary-400 max-md:text-base font-semibold'>Pakistan&apos;s Leading Training Institute</legend>
      <h1 className='text-5xl max-lg:text-4xl font-bold max-md:text-3xl max-xs:text-2xl'>Enroll in Pakistan&apos;s Most Advanced Tech Course</h1>
      <p className='text-2xl max-md:text-xl max-xs:text-lg font-semibold'>Next Batch Starting From <b className='underline'>{Date.now()}</b></p>
    </div>
  )
}

export default NextBatch
