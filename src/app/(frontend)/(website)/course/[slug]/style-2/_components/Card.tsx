'use client'
import Image from 'next/image'
// import React, { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronsRight } from 'lucide-react'
// import Link from 'next/link'
// import { useSearchParams } from 'next/navigation'

const Card = ({ title, subTitle, image }: any) => {

    return (
        // <Suspense fallback={<div>Loading...</div>} >
            <CardContent  title={title} subTitle={subTitle} image={image} />
        // </Suspense>
    )
}

function CardContent({ data, title, subTitle, image }: any) {

    // const formatTitle = (title: string) => {
    //     return title
    //         .toLowerCase()
    //         .replace(/[^a-z0-9\s-]/g, '')
    //         .replace(/\s+/g, '-')
    //         .replace(/-+/g, '-')
    // }

    // const linkWithQuery = `${data.link}?title=${formatTitle(data.title)}`
    // const searchParams = useSearchParams()
    // const currentTitle = searchParams.get('title')
    // const isActive = currentTitle === formatTitle(data.title)

    return (
        <div className={`min-w-56 p-2 border-2 border-primary-400 border-dashed rounded-lg  space-y-8 hover:shadow-2xl shadow-primary-400 pb-4 ${true ? 'bg-primary-400 text-card' : 'bg-card'}`}>
            <div className='relative aspect-square w-full'>
                <Image
                    // src={data.image}
                    src={image?.url ?? "/placeHolders/placeholderImg.jpg" }
                    // alt={data.alt}
                    alt={image?.alt ?? "url is not correct"}
                    fill
                    sizes='(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 10vw'
                    className='object-cover'
                />
            </div>
            <div className='text-sm px-1 space-y-4'>
                <h1 className='text-2xl line-clamp-2'>
                    <b className='font-semibold'>
                        {/* {data.title} */}
                        {title}
                   </b>
                </h1>
                <p className='line-clamp-2'>
                    {/* {data.description} */}
                    {subTitle}
                </p>
                {/* <Link href={linkWithQuery} className={`${isActive ? 'hidden' : 'block'}`}> */}
                    <Button className='p-6 text-lg font-semibold hover:bg-primary-400 shadow-[5px_5px_0px_hsl(var(--primary-400))] hover:shadow-[5px_5px_0px_hsl(var(--primary-500))]'>Learn More <ChevronsRight strokeWidth={4} /></Button>
                {/* </Link> */}
            </div>
        </div>
    )
}

export default Card
