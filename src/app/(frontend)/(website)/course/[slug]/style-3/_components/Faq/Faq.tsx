import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import React from 'react'


const Faq = ({ faq, title }: { faq: any[] | undefined | null, title: string }) => {
    return (
        <div className='container mx-auto mt-20 py-4 px-4 lg:px-40 text-foreground'>
            <div className="animate-slide-btt text-center my-4">
                <h1 className="text-[30px]  text-foreground font-semibold ">
                    FAQs About Online {title} Course
                </h1>
                <p className="text-[1rem] lg:text-[1rem] font-medium text-muted-foreground mt-2">
                    Here&apos;s everything you may ask.
                </p>
            </div>
            <div className='container mx-auto mt-12 lg:mt-16 w-full'>
                {!faq?.length ? <div>no FAQs found</div>
                    : <Accordion type="single" collapsible className="w-full ">
                        {faq.map((faq: any) => (
                            <AccordionItem key={faq.id} value={faq.id}>
                                <AccordionTrigger className='font-medium lg:font-semibold text-[14px] lg:text-[1rem]'>{faq.question}</AccordionTrigger>
                                <AccordionContent className='text-muted-foreground font-medium lg:font-semibold text-[12px] lg:text-[1rem]'>
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                }
            </div>
        </div>
    )
}

export default Faq