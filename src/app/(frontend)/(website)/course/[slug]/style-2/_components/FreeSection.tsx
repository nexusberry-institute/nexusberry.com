'use client'
import Image from 'next/image'
import React from 'react'
import { bgImg } from '@/app/(frontend)/(website)/_assets/images'
import { Button } from '@/components/ui/button'
import { Laptop } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const FreeSection = () => {
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.3 }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => observer.disconnect()
    }, [])

    return (
        <div className='container my-20 max-sm:my-10 mx-auto max-sm:px-4'>
            <div
                ref={sectionRef}
                className={`flex max-lg:flex-col bg-card container p-0 border-2 border-dashed border-primary-400 gap-5 rounded-2xl ${isVisible ? 'animate-slide-btt' : 'opacity-0'}`}
            >
                <div className='flex-none max-lg:left-0 relative w-5/12 max-lg:w-full aspect-[1031/580]'>
                    <Image
                        src={bgImg}
                        alt='bgImg'
                        fill
                        sizes='(max-width: 1200px) 42vw,(max-width: 1024px) 100vw'
                        className='object-cover p-2 rounded-l-2xl max-lg:rounded-t-2xl max-lg:rounded-b-none'
                    />
                </div>
                <div className='my-auto font-bold text-4xl max-sm:text-2xl text-center space-y-8 max-lg:pb-4'>
                    <h1>Learn How You Can Make More Money, Get More Customers & Get a Dream Job With Digital Marketing</h1>
                    <Button className='p-6 text-lg max-xs:text-xs font-semibold hover:bg-primary-400 shadow-[5px_5px_0px_hsl(var(--primary-400))] hover:shadow-[5px_5px_0px_hsl(var(--primary-500))]'>Attend a demo session for free <Laptop strokeWidth={2} size={16} />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default FreeSection
