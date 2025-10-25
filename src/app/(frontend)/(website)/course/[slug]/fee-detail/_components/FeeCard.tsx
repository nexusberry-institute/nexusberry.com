import { Button } from '@/components/ui/button'
import { ChevronsRight } from 'lucide-react'
import React from 'react'

const FeeCard = () => {
  return (
    <div className='rounded-2xl shadow-xl border-2 border-dashed border-primary-400 bg-card w-full items-center space-y-6 p-10'>
      <h1 className='text-2xl font-bold max-xs:text-xl mb-6'>Enroll by Paying fee in one go</h1>
      <h2 className='text-xl font-semibold max-xs:text-lg text-primary-400'>1 Payment of Rs 65,000</h2>
          <Button className='p-6 shadow-[5px_5px_0px_hsl(var(--primary-400))] hover:shadow-[5px_5px_0px_hsl(var(--primary-500))] text-lg font-semibold hover:bg-primary-400 max-xs:p-3 max-xs:text-base'>Click here to Enroll <ChevronsRight strokeWidth={4} /></Button>

    </div>
  )
}

export default FeeCard
