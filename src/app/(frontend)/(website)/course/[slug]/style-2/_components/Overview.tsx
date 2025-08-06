'use client'
import React, { useEffect, useRef, useState } from 'react'
import { bgImg } from '@/app/(frontend)/(website)/_assets/images'

const Overview = () => {
    const [count, setCount] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    setIsVisible(true)
                    const timer = setInterval(() => {
                        setCount(prev => {
                            if (prev === 100) {
                                clearInterval(timer)
                                return 100
                            }
                            return prev + 1
                        })
                    }, 20)
                    return () => clearInterval(timer)
                }
            },
            { threshold: 0.1 }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => observer.disconnect()
    }, [])

    return (
        <div style={{
            backgroundImage: `url(${bgImg.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
        }}
            ref={sectionRef}
            className='h-80 max-lg:h-fit lg:bg-fixed my-20 max-sm:my-10'>
            <div className='bg-foreground/70 bg-opacity-70 h-full text-card'>
                <div className='container padding-x padding-y mx-auto text-center space-y-8 max-md:space-y-6 max-sm:space-y-4 max-xs:space-y-2'>
                    <h1 className='text-4xl max-md:text-3xl max-sm:text-2xl font-bold'>Importance of Digital Marketing Overview Module</h1>
                    <div className={`grid grid-cols-4 gap-5 max-lg:gap-3 max-sm:gap-2 max-lg:grid-cols-2 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}>
                        <div className='border-2 padding-y lg:py-6 rounded-xl border-dashed border-primary-400 space-y-2'>
                            <h2 className='text-5xl max-lg:text-3xl max-sm:text-2xl font-bold font-openSans'>{count}%</h2>
                            <p className='font-semibold'>Strong Foundation</p>
                        </div>
                        <div className='border-2 padding-y lg:py-6 rounded-xl border-dashed border-primary-400 space-y-2'>
                            <h2 className='text-5xl max-lg:text-3xl max-sm:text-2xl font-bold font-openSans'>{count}%</h2>
                            <p className='font-semibold'>Importance of Digital Marketing</p>
                        </div>
                        <div className='border-2 padding-y lg:py-6 rounded-xl border-dashed border-primary-400 space-y-2'>
                            <h2 className='text-5xl max-lg:text-3xl max-sm:text-2xl font-bold font-openSans'>{count}%</h2>
                            <p className='font-semibold'>Competitive Edge</p>
                        </div>
                        <div className='border-2 padding-y lg:py-6 rounded-xl border-dashed border-primary-400 space-y-2'>
                            <h2 className='text-5xl max-lg:text-3xl max-sm:text-2xl font-bold font-openSans'>{count}%</h2>
                            <p className='font-semibold'>Setting up ground for upcoming modules</p>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Overview
