'use client'
// import React, { useEffect, useState } from 'react'
import HighlightsCard from './HighlightsCard'


const CourseHighlights = ({ title }: any) => {
  // const [activeSection, setActiveSection] = useState('')
  // useEffect(() => {
  //   const observer = new IntersectionObserver((entries) => {
  //     entries.forEach(entry=>{
  //       if(entry.isIntersecting){
  //         const sectionId = entry.target.id;
  //         setActiveSection(sectionId)
  //       }
  //     })
  //   })

  //   const arrayEle = ['show1', 'show2', 'show3']
  //   arrayEle.forEach(ele => {
  //     const element = document.getElementById(ele)
  //     if (element) {
  //       observer.observe(element)
  //     }
  //   })
  // }, [])

  const array: any = [
    'Guide by the Geeks',
    'Project-Driven Curriculum',
    'Career Launch Countdown',
    'Hybrid Dissemination',
  ]
  return (
    <div className="px-10 max-sm:px-2  py-8 space-y-10">
      <div className="text-center space-y-4">
        <h1 className="font-semibold text-2xl lg:text-4xl ">Full Stack Developer Course Highlights</h1>
        <p className="text-sm ">
          Explore what this online full stack development course is powered with.
        </p>
      </div>
      <div className="flex gap-8">
        <div className="flex flex-col gap-4 sticky top-32 h-fit max-lg:hidden">
          {array.map((item: any, ind: number) => (
            <button
              key={ind}
              className={`text-start font-semibold px-2 py-4 bg-secondary-300 ring-[1px] ring-foreground rounded-xl w-72 shadow-[4px_4px_0px_hsl(var(--foreground))]`}
            >
              {item}
            </button>
          ))}
        </div>
        <HighlightsCard />
      </div>
    </div>
  )
}
export default CourseHighlights
