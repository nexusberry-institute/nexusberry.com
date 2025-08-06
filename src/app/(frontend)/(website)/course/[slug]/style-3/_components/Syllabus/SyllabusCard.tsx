"use client"

import RichText from "@/components/RichText"
import { CircleArrowDown, CircleArrowUp } from "lucide-react"
import type React from "react"
import { useState } from "react"


const SyllabusCard = ({ modules }: any) => {
  const [openModules, setOpenModules] = useState<boolean[]>(new Array(modules).fill(false))

  const handleShowOptions = (index: number) => {
    setOpenModules((prevState) => prevState.map((state, idx) => (idx === index ? !state : false)))
  }

  return (
    <div className="container mx-auto mt-10 lg:mt-16 w-full">
      {modules.map((module: any, index: number) => (
        <div
          key={index}
          className={`border-2 bg-card text-foreground rounded-xl w-full cursor-pointer px-1 ${index > 0 ? "mt-4" : ""}`}
        >
          <div
            onClick={() => handleShowOptions(index)}
            className="flex justify-between items-center py-4 px-1 lg:py-8 lg:px-8"
          >
            <div className="flex gap-2 items-center">
              <h1 className="font-bold text-muted-foreground flex gap-1">
                <span className="hidden lg:block">Module </span>
                {index + 1}{" "}
              </h1>
              <h1 className="font-semibold">{module.heading}</h1>
            </div>
            <div>{openModules[index] ? <CircleArrowUp /> : <CircleArrowDown />}</div>
          </div>
          {openModules[index] && (
            <div className="px-1 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <RichText data={module.content} className="min-w-0 m-0 p-0" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default SyllabusCard

