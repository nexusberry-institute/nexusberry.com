"use client"

import Image from "next/image"
import type React from "react"
import { CircleCheck } from "lucide-react"
import img1 from "../../_assets/images/industry.svg"
import img2 from "../../_assets/images/learning.svg"
import img3 from "../../_assets/images/guided.svg"

interface HighlightItem {
  image: any
  title: string
  description: string
  bulletPoints?: string[]
}

const highlightData: HighlightItem[] = [
  {
    image: img1,
    title: "Industry-vetted curriculum",
    description:
      "With a project-based approach, this program is curated with hours of research and collaboration from hiring managers from top tech & product-based companies under the data analytics domain.",
  },
  {
    image: img2,
    title: "Cohort-Based Learning",
    description:
      "Immerse yourself in a collaborative, cohort-based learning environment, prioritizing hands-on problem-solving abilities. Enhance your skills within a community that flourishes through shared growth.",
    bulletPoints: [
      "Participate in projects and discussions that tackle real-world challenges, boosting your problem-solving skills with collaborative insights.",
      "Take advantage of a strong support network where peers inspire each other, fostering a spirit of growth and shared achievements.",
    ],
  },
  {
    image: img3,
    title: "Guided by the Geeks",
    description:
      "Thrive under the mentorship of seasoned industry mentors who impart their vast knowledge and insights. Each session is crafted to help you navigate the complexities, boosting your confidence as you master the craft. Incorporate advanced techniques and strategies from industry gurus keen to share their hidden formulas for excellence.",
  },
]

const HighlightsCard: React.FC = ({activeSection,setActiveSection}:any) => {
  return (
    <div className="mx-auto">
      <div className="max-lg:flex gap-4  overflow-auto max-lg:w-[600px] max-sm:w-[450px] max-xs:w-[350px] max-lg:p-4 lg:space-y-6 lg:p-4">
        {highlightData.map((item, index) => (
          <div
            key={index}
            id = {`show4${index}`}
            className={`flex bg-card flex-col lg:flex-row-reverse max-lg:min-w-[500px] max-sm:min-w-[350px]
              max-xs:w-[250px] max-lg:h-[34rem]  gap-8 ring-2 ring-foreground p-8 rounded-lg hover:shadow-[4px_4px_0px_hsl(var(--foreground))]`}
          >
            <div className="w-full aspect-[361/249] relative ">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                fill
                sizes=""
                className="rounded-sm object-contain"
              />
            </div>
            <div className="">
              <h1 className="text-foreground text-sm lg:text-lg font-semibold mt-2">{item.title}</h1>
              <p className="text-muted-foreground text-[10px] lg:text-[14px] mt-2">{item.description}</p>
              {item.bulletPoints &&
                item.bulletPoints.map((point, pointIndex) => (
                  <div key={pointIndex} className="flex gap-2 items-center mt-2 text-foreground">
                    <CircleCheck width={80} fill="#FDB034" color="#ffffff" />
                    <p className="text-muted-foreground text-[10px] lg:text-[14px] mt-2">{point}</p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HighlightsCard

