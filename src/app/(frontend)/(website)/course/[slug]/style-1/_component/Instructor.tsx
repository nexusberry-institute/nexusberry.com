// components/Instructor.tsx
"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Youtube } from 'lucide-react'
import NxBRoundLogo from '@/app/(frontend)/(website)/_assets/logo/round.jpg'

const Instructor = ({ instructor }: any) => {

    const companyData = {
        id: 1,
        name: "NexusBerry",
        socialLinks: {
            youtube: "https://www.youtube.com/@nexusberry.trainings",
            facebook: "https://www.facebook.com/nexusberry",
        }
    }

    return (
        <div className='flex bg-card border relative rounded-xl w-full shadow-md p-4 max-sm:p-2 gap-4 max-sm:gap-2'>
            <div className='relative aspect-square w-24 max-sm:w-16'>
                <Image
                    src={instructor?.profileImage?.url ?? NxBRoundLogo}
                    alt={instructor?.profileImage?.alt ?? "Instructor Picture"}
                    fill
                    sizes='(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 10vw'
                    className='object-cover rounded-full'
                />
            </div>
            <div className='my-auto'>
                <h2 className='text-2xl max-sm:text-xl font-semibold'>
                    {instructor?.name ?? "NexusBerry"}
                </h2>
                <p className='text-lg max-sm:text-base text-muted-foreground'>Instructor</p>
            </div>
            <div className='flex right-0 absolute gap-3 max-sm:gap-1 pr-4 max-sm:pr-1'>
                {companyData.socialLinks.youtube && (
                    <Link
                        href={companyData.socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-110 transition-transform duration-200"
                        aria-label="Visit YouTube channel"
                    >
                        <Youtube size={30} strokeWidth={0.5} className='stroke-blue-100 max-sm:size-4 fill-primary-700' />
                    </Link>
                )}
                {companyData.socialLinks.facebook && (
                    <Link
                        href={companyData.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-110 transition-transform duration-200"
                        aria-label="Visit Facebook page"
                    >
                        <Facebook size={30} strokeWidth={0.5} className='stroke-blue-100 max-sm:size-4 fill-primary-700' />
                    </Link>
                )}

            </div>

        </div>

    )
}

export default Instructor
