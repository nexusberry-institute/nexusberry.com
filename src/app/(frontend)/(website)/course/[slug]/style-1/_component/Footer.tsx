import React from 'react'
import { Facebook, InstagramIcon, LucideLinkedin, Twitter, Youtube } from 'lucide-react'
import logo from '@/app/(frontend)/(website)/_assets/logo/reverse-logo.png'
import Image from 'next/image'

const Footer = () => {
    const data = ['Courses', 'The Batch', 'Community', 'Careers', 'About']
    return (
        <div className='text-center space-y-6 max-sm:space-y-4 py-16 max-sm:pt-10 max-lg:pb-24 bg-primary text-background'>
            <div className='relative w-64 max-sm:w-48 aspect-[4/1] mx-auto'>
                <Image
                    alt='logo'
                    src={logo}
                    fill
                    className='object-cover'
                /></div>
            <div className='flex flex-wrap justify-center gap-12 max-sm:gap-8 text-secondary-300 text-xl max-sm:text-base'>
                {
                    data.map((dd) => (
                        <span className='hover:underline' key={dd}>{dd}</span>
                    ))
                }
            </div>
            <div className='flex justify-center gap-12 max-sm:gap-8' id='social'>
                {[
                    { icon: <Facebook className='bg-background fill-primary stroke-primary stroke-1 rounded-full' />, id: 'facebook' },
                    { icon: <InstagramIcon />, id: 'instagram' },
                    { icon: <Twitter />, id: 'twitter' },
                    { icon: <LucideLinkedin />, id: 'linkedin' },
                    { icon: <Youtube />, id: 'youtube' }
                ].map(({ icon, id }) => (
                    <span key={id}>{icon}</span>
                ))}
            </div>

        </div>
    )
}

export default Footer
