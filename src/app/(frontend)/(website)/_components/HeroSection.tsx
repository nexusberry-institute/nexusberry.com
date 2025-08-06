import Image from 'next/image'
import Link from 'next/link';
import React from 'react'
import { MearnHomeImg, FlutterHomeImg, MLHomeImg, adobeLogo, DjangoLogo, FlutterLogo, JsLogo, NextLogo, NodejsLogo, powerbiLogo, pythonLogo, ReactLogo, tensorFlowLogo } from '../_assets/images'
import CoursesLogo from './CoursesLogo'

const HeroSection = () => {
    const courses = [
        {
            name: 'Next Js',
            img: NextLogo,
            link: '#',
        },
        {
            name: 'React Js',
            img: ReactLogo,
            link: '#',
        },
        {
            name: 'Node Js',
            img: NodejsLogo,
            link: '#',
        },
        {
            name: 'Flutter',
            img: FlutterLogo,
            link: '#',
        },
        {
            name: 'Django',
            img: DjangoLogo,
            link: '#',
        },
        {
            name: 'Adobe',
            img: adobeLogo,
            link: '#',
        },
        {
            name: 'Python',
            img: pythonLogo,
            link: '#',
        },
        {
            name: 'JavaScript',
            img: JsLogo,
            link: '#',
        },
        {
            name: 'Power BI',
            img: powerbiLogo,
            link: '#',
        },
        {
            name: 'Tensor Flow',
            img: tensorFlowLogo,
            link: '#',
        },
        {
            name: 'Python',
            img: pythonLogo,
            link: '#',
        },

    ]
    return (
        <div className='container mt-14 mb-4 max-md:px-4'>
            <div className='grid grid-flow-row sm:grid-cols-3 max-sm:grid-cols-2 gap-1'>
                <div className='relative aspect-[8/3] col-span-2 row-span-2'>
                    <Link href="/course/mern-stack-course">
                        <Image
                            alt='mearn'
                            src={MearnHomeImg}
                            sizes=''
                            fill
                            className='object-cover'
                        />
                    </Link>
                </div>

                <div className='relative aspect-[8/3]'>
                    <Link href="/course/flutter-and-dart-expert-level-training-course">
                        <Image
                            alt='flutter'
                            src={FlutterHomeImg}
                            sizes=''
                            fill
                            className='object-cover'
                        />
                    </Link>
                </div>

                <div className='relative aspect-[8/3]'>
                    <Link href="/course/data-science-machine-learning-ai-engineer">
                        <Image
                            alt='ML'
                            src={MLHomeImg}
                            sizes=''
                            fill
                            className='object-cover'
                        />
                    </Link>
                </div>
            </div>
            <CoursesLogo courses={courses} />
        </div>
    )
}

export default HeroSection
