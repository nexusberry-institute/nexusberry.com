import Image from 'next/image'
import React from 'react'
import RichText from '@/components/RichText'
import { Event, Media, Instructor } from '@/payload-types'
import { ourMentor } from '@/app/(frontend)/(website)/_assets/images'



export default function CourseDetail({ 
  learningOutcomes, 
  image, 
  instructor 
}: { 
  learningOutcomes: Exclude<Event["learningOutcomes"], undefined | null>, 
  image: Media | null | undefined,
  instructor?: number | Instructor | null
}) {
  // Extract text content from RichText and get first 4 items
  const extractTextFromRichText = (richTextData: any): string[] => {
    if (!richTextData) return []
    
    // Handle the new structure with root property
    let dataToProcess = richTextData
    if (richTextData.root && richTextData.root.children) {
      dataToProcess = richTextData.root.children
    } else if (!Array.isArray(richTextData)) {
      return []
    }
    
    const textItems: string[] = []
    
    const traverse = (nodes: any[]) => {
      nodes.forEach(node => {
        // Handle list items
        if (node.type === 'listitem' && node.children) {
          let itemText = ''
          const extractText = (children: any[]) => {
            children.forEach(child => {
              if (child.text) {
                itemText += child.text
              }
              if (child.children) {
                extractText(child.children)
              }
            })
          }
          extractText(node.children)
          if (itemText.trim()) {
            textItems.push(itemText.trim())
          }
        }
        // Handle paragraph nodes
        else if (node.type === 'paragraph' && node.children) {
          let paragraphText = ''
          const extractText = (children: any[]) => {
            children.forEach(child => {
              if (child.text) {
                paragraphText += child.text
              }
              if (child.children) {
                extractText(child.children)
              }
            })
          }
          extractText(node.children)
          if (paragraphText.trim()) {
            textItems.push(paragraphText.trim())
          }
        }
        
        if (node.children) {
          traverse(node.children)
        }
      })
    }
    
    traverse(Array.isArray(dataToProcess) ? dataToProcess : [dataToProcess])
    return textItems
  }

  const learningItems = extractTextFromRichText(learningOutcomes).slice(0, 4)

  return (
    <div className='mx-4 md:mx-8 lg:mx-10 mt-12 md:mt-16 lg:mt-20'>
      <div className="text-center mb-8 md:mb-12 lg:mb-16">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
          Meet Your <span className="text-primary italic">mentor</span> & Unlock Key Learnings
        </h2>
      </div>
      
      <div className='flex flex-col lg:flex-row gap-6 lg:gap-8'>
        {/* Left side - Instructor card (35% width on desktop) */}
        <div className='w-full lg:w-[35%] order-1 lg:order-1 flex justify-center'>
          <div className="relative mx-auto w-fit flex flex-col items-center gap-3 md:gap-4 text-center">
            <div className="w-36 md:w-40 lg:w-44 rounded-full bg-muted aspect-square overflow-hidden relative">
              <Image
                src={
                  typeof instructor === 'number'
                    ? '/nexusberryLogo.png'
                    : typeof instructor?.profileImage === 'object'
                      ? (instructor.profileImage.url ?? '/nexusberryLogo.png')
                      : '/nexusberryLogo.png'
                }
                alt={
                  typeof instructor === 'number'
                    ? 'Nexusberry Instructor'
                    : typeof instructor?.profileImage === 'object'
                      ? (instructor.profileImage.alt ?? 'Nexusberry Instructor')
                      : 'Nexusberry Instructor'
                }
                className="object-cover"
                fill
                sizes="(max-width: 768px) 144px, (max-width: 1024px) 160px, 176px"
                priority
              />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-lg md:text-xl">
                {instructor && typeof instructor === 'object' && instructor.name
                  ? instructor.name
                  : 'Nexusberry Trainer'}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground">
                {instructor && typeof instructor === 'object' && instructor.experience
                  ? `${instructor.experience}+ Years of Professional Experience`
                  : '18+ Years of Professional Experience'}
              </p>
            </div>
            <Image
              src={ourMentor}
              alt="our mentor"
              className="absolute top-0 -left-10 md:-left-12 lg:-left-14"
              sizes="(max-width: 768px) 90px, (max-width: 1024px) 107px, 120px"
              width={120}
              height={45}
            />
          </div>
        </div>

        {/* Right side - Learning outcomes container (65% width on desktop) */}
        <div className='w-full lg:w-[65%] order-2 lg:order-2 flex'>
          {learningItems.length > 0 ? (
            <div className="relative bg-card border border-border rounded-2xl p-6 md:p-8 lg:p-10 shadow-lg w-full">
              {/* Vertical dashed divider - hidden on mobile */}
              <div className="pointer-events-none absolute left-1/2 top-6 md:top-8 lg:top-10 bottom-6 md:bottom-8 lg:bottom-10 -translate-x-1/2 w-px bg-repeat-y bg-[length:1px_10px] hidden md:block" style={{backgroundImage: 'linear-gradient(to bottom, hsl(var(--border)) 50%, transparent 50%)'}}></div>
              {/* Horizontal dashed divider - hidden on mobile */}
              <div className="pointer-events-none absolute top-1/2 left-6 md:left-8 lg:left-10 right-6 md:right-8 lg:right-10 -translate-y-1/2 h-px bg-repeat-x bg-[length:10px_1px] hidden md:block" style={{backgroundImage: 'linear-gradient(to right, hsl(var(--border)) 50%, transparent 50%)'}}></div>

              <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-auto md:grid-rows-2 gap-6 md:gap-x-8 lg:gap-x-12 md:gap-y-8">
                <div className="flex items-center justify-center text-center">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground">
                      {"Core Concepts & Foundation"}
                    </h3>
                    <p className="mt-2 md:mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                      {learningItems[0] ?? ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center text-center">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground">
                      {"Practical Implementation"}
                    </h3>
                    <p className="mt-2 md:mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                      {learningItems[1] ?? ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center text-center">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground">
                      {"Hands-on Experience"}
                    </h3>
                    <p className="mt-2 md:mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                      {learningItems[2] ?? ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center text-center">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground">
                      {"Advanced Techniques"}
                    </h3>
                    <p className="mt-2 md:mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                      {learningItems[3] ?? ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg h-full">
              <div className='list-disc [&_ul]:list-disc [&_ul]:ml-[0px] md:[&_ul]:ml-[18px] [&_ul]:mt-0  [&_li]:mb-2 [&_li]:text-base md:[&_li]:text-lg'>
                <RichText data={learningOutcomes} className='min-w-full p-0 m-0 ' />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
