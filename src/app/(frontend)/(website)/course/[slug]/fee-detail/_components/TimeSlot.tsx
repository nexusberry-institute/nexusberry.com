'use client'
import { CountdownTimer } from '@/components/CountDownTimer'
import React from 'react'

const TimeSlot = () => {
    const timeLeft = CountdownTimer({ date: '2025-12-31' })

    return (
        <div className='flex justify-center gap-4 max-md:gap-2'>
            <div className='w-80 h-36 max-sm:h-28 flex flex-col justify-center items-center bg-foreground text-card'>
                <h1 className='text-card text-7xl max-md:text-5xl max-sm:text-4xl font-openSans'>{timeLeft.days}</h1>
                <span className='text-lg'>Days</span>
            </div>
            <div className='w-80 h-36 max-sm:h-28 flex flex-col justify-center items-center bg-foreground text-card'>
                <h1 className='text-card text-7xl max-md:text-5xl max-sm:text-4xl font-openSans'>{timeLeft.hours}</h1>
                <span className='text-lg'>Hours</span>
            </div>
            <div className='w-80 h-36 max-sm:h-28 flex flex-col justify-center items-center bg-foreground text-card'>
                <h1 className='text-card text-7xl max-md:text-5xl max-sm:text-4xl font-openSans'>{timeLeft.minutes}</h1>
                <span className='text-lg'>Minutes</span>
            </div>
            <div className='w-80 h-36 max-sm:h-28 flex flex-col justify-center items-center bg-foreground text-card'>
                <h1 className='text-card text-7xl max-md:text-5xl max-sm:text-4xl font-openSans'>{timeLeft.seconds}</h1>
                <span className='text-lg'>Seconds</span>
            </div>

        </div>
    )
}

export default TimeSlot
