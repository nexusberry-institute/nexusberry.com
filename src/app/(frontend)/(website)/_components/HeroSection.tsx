import Image from 'next/image'
import Link from 'next/link';
import React from 'react'
import { MearnHomeImg, FlutterHomeImg, MLHomeImg, adobeLogo, DjangoLogo, FlutterLogo, JsLogo, NextLogo, NodejsLogo, powerbiLogo, pythonLogo, ReactLogo, tensorFlowLogo } from '../_assets/images'
import CoursesLogo from './CoursesLogo'
import type { HomePage, Media } from '@/payload-types'

type HeroProps = {
    hero?: HomePage['hero']
}

const defaultFeaturedImages = [
    { image: MearnHomeImg, alt: 'mearn', link: '/course/mern-stack-course' },
    { image: FlutterHomeImg, alt: 'flutter', link: '/course/flutter-and-dart-expert-level-training-course' },
    { image: MLHomeImg, alt: 'ML', link: '/course/data-science-machine-learning-ai-engineer' },
]

const defaultLogos = [
    { name: 'Next Js', img: NextLogo, link: '#' },
    { name: 'React Js', img: ReactLogo, link: '#' },
    { name: 'Node Js', img: NodejsLogo, link: '#' },
    { name: 'Flutter', img: FlutterLogo, link: '#' },
    { name: 'Django', img: DjangoLogo, link: '#' },
    { name: 'Adobe', img: adobeLogo, link: '#' },
    { name: 'Python', img: pythonLogo, link: '#' },
    { name: 'JavaScript', img: JsLogo, link: '#' },
    { name: 'Power BI', img: powerbiLogo, link: '#' },
    { name: 'Tensor Flow', img: tensorFlowLogo, link: '#' },
    { name: 'Python', img: pythonLogo, link: '#' },
]

const HeroSection = ({ hero }: HeroProps) => {
    const hasCmsImages = hero?.featuredImages && hero.featuredImages.length > 0
    const hasCmsLogos = hero?.logoCarousel && hero.logoCarousel.length > 0

    const featuredImages = hasCmsImages
        ? hero.featuredImages!.map((item) => ({
            image: typeof item.image === 'object' ? (item.image as Media)?.url : null,
            alt: item.alt || '',
            link: item.link,
        }))
        : null

    const logoItems = hasCmsLogos
        ? hero.logoCarousel!.map((item) => ({
            name: item.name,
            img: typeof item.image === 'object' ? (item.image as Media)?.url : null,
            link: item.link || '#',
        }))
        : defaultLogos

    return (
        <div className='container mt-14 mb-4 max-md:px-4'>
            <div className='grid grid-flow-row sm:grid-cols-3 max-sm:grid-cols-2 gap-1'>
                {featuredImages ? (
                    <>
                        {featuredImages[0] && (
                            <div className='relative aspect-[8/3] col-span-2 row-span-2'>
                                <Link href={featuredImages[0].link}>
                                    <Image
                                        alt={featuredImages[0].alt}
                                        src={featuredImages[0].image!}
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
                                        alt={featuredImages[1].alt}
                                        src={featuredImages[1].image!}
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
                                        alt={featuredImages[2].alt}
                                        src={featuredImages[2].image!}
                                        sizes=''
                                        fill
                                        className='object-cover'
                                    />
                                </Link>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className='relative aspect-[8/3] col-span-2 row-span-2'>
                            <Link href={defaultFeaturedImages[0]!.link}>
                                <Image
                                    alt={defaultFeaturedImages[0]!.alt}
                                    src={defaultFeaturedImages[0]!.image}
                                    sizes=''
                                    fill
                                    className='object-cover'
                                />
                            </Link>
                        </div>
                        <div className='relative aspect-[8/3]'>
                            <Link href={defaultFeaturedImages[1]!.link}>
                                <Image
                                    alt={defaultFeaturedImages[1]!.alt}
                                    src={defaultFeaturedImages[1]!.image}
                                    sizes=''
                                    fill
                                    className='object-cover'
                                />
                            </Link>
                        </div>
                        <div className='relative aspect-[8/3]'>
                            <Link href={defaultFeaturedImages[2]!.link}>
                                <Image
                                    alt={defaultFeaturedImages[2]!.alt}
                                    src={defaultFeaturedImages[2]!.image}
                                    sizes=''
                                    fill
                                    className='object-cover'
                                />
                            </Link>
                        </div>
                    </>
                )}
            </div>
            <CoursesLogo courses={logoItems} />
        </div>
    )
}

export default HeroSection
