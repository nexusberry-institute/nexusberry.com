"use client";

import { CountdownTimer } from '@/components/CountDownTimer'
import React from 'react'

const EventCountDown = ({ startDateTime }: { startDateTime: string }) => {
    const timeLeft = CountdownTimer({ date: startDateTime })

    return (
        <div className='flex gap-5 text-4xl font-semibold max-lg:hidden'>
            <div className='flex flex-col gap-1  items-center'>
                <div>{timeLeft.days}</div>
                <div className='text-sm font-semibold'>Days</div>
            </div>
            <div>:</div>
            <div className='flex flex-col gap-1 items-center'>
                <div>{timeLeft.hours}</div>
                <div className='text-sm font-semibold'>Hours</div>
            </div>
            <span>:</span>
            <div className='flex flex-col gap-1 items-center'>
                <div>{timeLeft.minutes}</div>
                <div className='text-sm font-semibold'>Minuts</div>
            </div>
            <span>:</span>
            <div className='flex flex-col gap-1 items-center'>
                <div>{timeLeft.seconds}</div>
                <div className='text-sm font-semibold'>seconds</div>
            </div>
        </div>
    )
}

export default EventCountDown