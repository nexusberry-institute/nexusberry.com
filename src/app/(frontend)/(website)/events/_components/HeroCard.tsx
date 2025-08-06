'use client'
import Image from 'next/image'
import type { UseEmblaCarouselType } from 'embla-carousel-react'
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { Event } from '@/payload-types'


export default function HeroCard({ eventData }: {
  eventData: Event[]
}) {

  const [carouselApi, setCarouselApi] = useState<UseEmblaCarouselType[1] | null>(null)

  useEffect(() => {
    if (carouselApi) {
      const timer = setInterval(() => {
        carouselApi?.scrollNext()
      }, 2000)
      return () => clearInterval(timer)
    }
  }, [carouselApi])

  return (
    <Carousel
      opts={{ align: 'start', loop: true }}
      setApi={setCarouselApi}
      orientation="vertical"
      className="w-full max-w-sm  -z-10 max-lg:hidden"
    >
      <CarouselContent className="-mt-1 h-[33rem] ">

        {!eventData.length ?
          ['/web2.jpg', '/app.jpg', '/machine.jpg'].map((eventImage, index) => (
            <CarouselItem key={index} className="pt-1 basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex items-center justify-center p-0 rounded-xl">
                    <div key={index} className="w-full aspect-[858/432] relative ">
                      <Image
                        priority={index === 0}
                        src={eventImage}
                        fill
                        alt={`Image ${index + 1} not  available `}
                        className="rounded-xl"
                        sizes="380px"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>)
          ) : (
            eventData.slice(0, 6).map((eventImage, index) => (
              <CarouselItem key={index} className="pt-1 basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex items-center justify-center p-0 rounded-xl">
                      <div key={index} className="w-full aspect-[858/432] relative ">
                        <Image
                          priority={index === 0}
                          src={typeof eventImage.image === 'object' ? (eventImage.image?.url ?? '/placeholderImg.jpg') : '/placeholderImg.jpg'}
                          fill
                          alt={typeof eventImage.image === 'object' ? (eventImage.image?.alt ?? "Event img") : "Event img"}
                          className="rounded-xl"
                          sizes="380px"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>)
            ))}
      </CarouselContent>
    </Carousel>
  )
}
