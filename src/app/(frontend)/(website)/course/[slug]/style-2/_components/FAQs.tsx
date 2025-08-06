import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import React from 'react'

const FAQs = ({ faqData }: any) => {
    return (
        <div className='container max-md:text-center max-md:px-4'>
            <legend className='text-lg text-primary-400 font-semibold'>Quick Answers</legend>
            <h2 className='text-5xl font-bold mb-6 max-md:text-4xl max-sm:text-3xl'>Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full ">
                {faqData.map((faq: any) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger className='text-xl max-sm:text-lg'>{faq.question}</AccordionTrigger>
                        <AccordionContent className='text-base max-sm:text-sm'>
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

        </div>
    )
}

export default FAQs
