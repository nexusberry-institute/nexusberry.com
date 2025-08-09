"use client";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Quote } from "lucide-react";
import RichText from '@/components/RichText'
import { Url } from "next/dist/shared/lib/router/router";
import { Media } from "@/payload-types";


interface Testimonial {
    content?: any | null;
    name: string;
    university?: string | null;
    cardImage?: string | null | undefined | number | Media; // Adjusted type to match the expected data structure

}

interface Stat {
    value: string;
    description: string;
}



interface ImpactSectionProps {
    heading: string;
    subheading: string | null;
    stats: Stat[];
    testimonials: Testimonial[];
    // Optional prop for card image
}


export default function ImpactSection({
    heading,
    subheading,
    stats,
    testimonials,
}: ImpactSectionProps) {
    // console.log("ImpactSection Props:", cardImage);
    // console.log("All RichText Data", testimonials);
    return (
        <section className="container py-16 px-4 sm:px-8">
            {/* Top Heading */}
            <div className="text-left mx-auto mb-12">
                <h1 className="bg-primary text-white px-3 py-1 rounded-sm inline-block mb-4 font-semibold text-lg md:text-3xl leading-10">
                    {heading}
                </h1>
                <p className="text-lg text-gray-700 font-medium leading-relaxed">
                    {subheading}
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-16 max-w-6xl mx-auto">
                {stats?.map((item, index) => (
                    <div key={index} className="space-y-4">
                        <p className="text-6xl font-bold text-primary-700 leading-none">
                            {item.value}
                        </p>
                        <p className="text-gray-700 text-base leading-relaxed max-w-xs">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Testimonials */}
            <div className="max-w-6xl mx-auto relative">
                <Carousel className="w-full">
                    <div className="flex justify-end mb-4">
                        <div className="flex gap-2">
                            <CarouselPrevious className="relative inset-0 translate-y-0" />
                            <CarouselNext className="relative inset-0 translate-y-0" />
                        </div>
                    </div>
                    <CarouselContent>
                        {testimonials?.map((testimonial, index) => (
                            <CarouselItem key={index} className="md:basis-1/1 lg:basis-1/1">
                                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                                    <div className="flex flex-col md:flex-row items-center gap-4"> {/* increased space */}
                                        {/* IMAGE LEFT SIDE */}
                                        <div className="flex-shrink-0">
                                            {typeof testimonial.cardImage === 'object' &&
                                                testimonial.cardImage &&
                                                'url' in testimonial.cardImage ? (
                                                <img
                                                    src={testimonial.cardImage.url || "/default-avatar.png"}
                                                    alt={testimonial.cardImage.alt || testimonial.name}
                                                    className="object-cover h-40 w-40 mx-auto md:mx-0 rounded-full border-2 border-primary-500"
                                                />
                                            ) : (
                                                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mx-auto md:mx-0 border-2 border-primary-500">
                                                    <span className="text-gray-500 text-xl">
                                                        {testimonial.name?.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* CONTENT */}
                                        <div className="flex-1">
                                            <div className="mb-6">
                                                {/* <p className="text-gray-800 text-base leading-relaxed">{testimonial.text}</p> */}
                                                <RichText data={testimonial.content} className='min-w-full p-0 m-0' />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-gray-900">{testimonial.name}</p>
                                                <p className="text-sm text-gray-500">{testimonial.university}</p>
                                            </div>
                                        </div>
                                        {/* QUOTE ICON RIGHT SIDE */}
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 rounded flex items-center justify-center">
                                                <span className="text-primary text-xl font-bold">
                                                    <Quote />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                </Carousel>
            </div>
        </section>
    );
}
