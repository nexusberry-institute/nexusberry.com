"use client"

import { ClipboardCheck, Goal, GraduationCap, PencilLine } from "lucide-react"
import React from "react"

interface WorkStep {
  icon: React.ElementType
  title: string
  description: string
  additionalInfo?: string
  animationClass: string
  borderClass: string
  hoverClass: string
}

const workSteps: WorkStep[] = [
  {
    icon: GraduationCap,
    title: "Learn",
    description: "Upskill yourself by gaining insights from leading professionals' vast experience.",
    additionalInfo: "Live Classes Self-Spaced",
    animationClass: "animate-slide-rtl",
    borderClass: "border-dashed border-t border-l border-b",
    hoverClass: "hover:bg-gradient-to-r from-primary-100 to-blue-0",
  },
  {
    icon: PencilLine,
    title: "Practice",
    description:
      "Sharpen your skills by learning through course assignments, live projects, and regular assessments and quizzes.",
    animationClass: "animate-slide-ltr",
    borderClass: "border-dashed border-r border-b",
    hoverClass: "hover:bg-gradient-to-l from-primary-100 to-blue-0",
  },
  {
    icon: ClipboardCheck,
    title: "Ask",
    description: "Resolve your queries from industry experts with our dedicated one-to-one doubt-clearing sessions.",
    animationClass: "animate-slide-rtl",
    borderClass: "border-dashed border-l border-b",
    hoverClass: "hover:bg-gradient-to-r from-primary-100 to-blue-0",
  },
  {
    icon: Goal,
    title: "Build",
    description:
      "Craft a diverse portfolio and appealing resume, and optimize LinkedIn to showcase your data analytics skills.",
    animationClass: "animate-slide-ltr",
    borderClass: "border-dashed border-r border-b",
    hoverClass: "hover:bg-gradient-to-l from-primary-100 to-blue-0",
  },
]

interface WorkingProps {
  title: string
}

const Working: React.FC<WorkingProps> = ({ title }) => {
  return (
    <div className="container mx-auto text-card lg:pt-20">
      <div className="p-4 flex flex-col lg:flex-row items-center">
        <div className="animate-slide-ltr lg:w-[40%] flex flex-col justify-center items-center lg:justify-center lg:items-start lg:pr-32">
          <h1 className="text-[32px] [line-height: 48px] font-semibold text-center text-foreground lg:text-start">
            How Does This {title} Course Work?
          </h1>
          <button className="hidden lg:block bg-primary-500 p-4 rounded-xl text-card font-medium items-start w-40 my-4 hover:border-r-2 hover:border-b-2">
            Apply Now
          </button>
        </div>
        <div className="lg:w-[60%] flex flex-col cursor-pointer gap-0 mt-10 lg:mt-0">
          {workSteps.map((step, index) => (
            <div
              key={index}
              className={`group m-0 py-8 ${step.borderClass} border-muted-foreground ${step.hoverClass} duration-300 ease-in-out`}
            >
              <div
                className={`${step.animationClass} flex flex-col lg:flex-row gap-5 ${index % 2 === 0 ? "lg:ml-10" : "lg:ml-24"} lg:justify-start text-center lg:text-start items-center justify-center text-foreground lg:w-[80%]`}
              >
                <step.icon className="w-14 h-14 lg:w-16 lg:h-16 group-hover:text-primary-500" />
                <div className="flex flex-col lg:flex-col lg:items-start gap-2 items-center">
                  <div className="flex gap-3 items-center">
                    <h1 className="text-2xl font-bold">{step.title}</h1>
                    {step.additionalInfo && (
                      <span className="flex bg-warning rounded-xl py-1 px-2 text-[10px] font-medium gap-1">
                        {step.additionalInfo.split(" ").map((info, i) => (
                          <React.Fragment key={i}>
                            {i > 0 && <li className="ml-2">{info}</li>}
                            {i === 0 && info}
                          </React.Fragment>
                        ))}
                      </span>
                    )}
                  </div>
                  <p className="text-[14px] font-medium text-muted-foreground">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="lg:hidden bg-primary-500 p-4 rounded-xl text-card font-medium items-center w-40 my-4 hover:border-r-2 hover:border-b-2">
          Apply Now
        </button>
      </div>
    </div>
  )
}

export default Working

