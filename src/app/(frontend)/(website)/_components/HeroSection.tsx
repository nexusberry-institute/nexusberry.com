import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import CoursesLogo from './CoursesLogo'
import type { HomePage, Media } from '@/payload-types'

type HeroProps = {
    hero?: HomePage['hero']
}

const HeroSection = ({ hero }: HeroProps) => {
    const featuredImages = hero?.featuredImages?.filter(
        (item) => typeof item.image === 'object' && (item.image as Media)?.url,
    )
    const logoCarousel = hero?.logoCarousel?.filter(
        (item) => typeof item.image === 'object' && (item.image as Media)?.url,
    )

    const hasImages = featuredImages && featuredImages.length > 0
    const hasLogos = logoCarousel && logoCarousel.length > 0

    if (!hasImages && !hasLogos) return null

    return (
        <div className='container mt-14 mb-4 max-md:px-4'>
            {hasImages && (
                <div className='grid grid-flow-row sm:grid-cols-3 max-sm:grid-cols-2 gap-1'>
                    {featuredImages[0] && (
                        <div className='relative aspect-[8/3] col-span-2 row-span-2'>
                            <Link href={featuredImages[0].link}>
                                <Image
                                    alt={featuredImages[0].alt || ''}
                                    src={(featuredImages[0].image as Media).url!}
                                    sizes=''
                                    fill
                                    className='object-cover'
                                />
                            </Link>
                        </div>
                    )}
                    {featuredImages[1] && (
                        <div className='relative aspect-[8/3]'>
                            <Link href={featuredImages[1].link}>
                                <Image
                                    alt={featuredImages[1].alt || ''}
                                    src={(featuredImages[1].image as Media).url!}
                                    sizes=''
                                    fill
                                    className='object-cover'
                                />
                            </Link>
                        </div>
                    )}
                    {featuredImages[2] && (
                        <div className='relative aspect-[8/3]'>
                            <Link href={featuredImages[2].link}>
                                <Image
                                    alt={featuredImages[2].alt || ''}
                                    src={(featuredImages[2].image as Media).url!}
                                    sizes=''
                                    fill
                                    className='object-cover'
                                />
                            </Link>
                        </div>
                    )}
                </div>
            )}
            {hasLogos && (
                <CoursesLogo
                    courses={logoCarousel.map((item) => ({
                        name: item.name,
                        img: (item.image as Media).url!,
                        link: item.link || '#',
                    }))}
                />
            )}
        </div>
    )
}

export default HeroSection
