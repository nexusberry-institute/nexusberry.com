import { Button } from '@/components/ui/button'
import { ChevronsRight, Download } from 'lucide-react'
import React from 'react'
import HeroVideo from '../../style-1/_component/HeroSection/HeroVideo'
import { bgImg } from '@/app/(frontend)/(website)/_assets/images'
import Link from 'next/link'

const ModelHero = ({ title, image }: any) => {
    return (
        <div style={{
            backgroundImage: `url(${bgImg.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
        }}
            className='h-[28rem] max-lg:h-fit lg:bg-fixed'>
            <div className='bg-foreground/70 bg-opacity-70 h-full text-card'>
                <div className='flex container max-lg:flex-col max-lg:items-center max-lg:text-center mx-auto justify-center gap-10 padding-x padding-y'>
                    <div className='space-y-10 max-xl:space-y-6 pt-10 max-lg:pt-0'>
                        <div className='space-y-4 max-xl:space-y-2'>
                            <legend className='text-2xl'>Module 13:</legend>
                            <h1 className='text-6xl max-xl:text-5xl max-md:text-4xl font-bold'>{title}</h1>
                            <p className='text-xl'>If you cannot measure it, you cannot improve it</p>
                        </div>
                        <div className=' space-x-10 max-xl:space-x-6 space-y-6 max-xs:space-y-4 max-lg:text-wrap lg:text-nowrap mx-auto my-auto'>
                            <Link href={'/enroll-now'}><Button className='p-6 text-lg max-xl:text-base max-xl:p-4 max-sm:text-sm font-semibold hover:bg-primary-400 shadow-[6px_6px_0px_hsl(var(--primary-400))] hover:shadow-[5px_5px_0px_hsl(var(--primary-500))]'>Click here to Enroll <ChevronsRight strokeWidth={4} /></Button></Link>
                            <Button className='p-6 text-xl max-lg:text-base max-xl:p-4 max-sm:text-sm max-lg:p-2 max-lg:font-semibold font-semibold hover:bg-primary-400 shadow-[6px_6px_0px_hsl(var(--primary-400))] hover:shadow-[5px_5px_0px_hsl(var(--primary-500))]'>Download Course Curiculum <Download strokeWidth={4} /></Button>
                        </div>
                    </div>
                    <div className='w-full md:px-32 px-10 lg:px-1 max-sm:px-2'>
                        <HeroVideo image={image} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModelHero
