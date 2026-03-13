import { CalendarDays, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import type { HomePage } from "@/payload-types"

type EventsProps = {
  config?: HomePage['eventsSection']
}

export default function Events({ config }: EventsProps) {
  const badgeText = config?.badgeText || "Upcoming Events"
  const heading = config?.heading || "Discover Amazing Events"
  const description = config?.description || "Join thousands of professionals at our carefully curated events designed to inspire, educate, and connect."
  const ctaHeading = config?.ctaHeading || "Ready to Join the Experience?"
  const ctaDescription = config?.ctaDescription || "Do not miss out on networking opportunities, expert insights, and unforgettable experiences."
  const buttonText = config?.buttonText || "Explore All Events"
  const buttonLink = config?.buttonLink || "/events"

  // Split heading to style last word with gradient
  const headingWords = heading.split(" ")
  const headingStart = headingWords.slice(0, -1).join(" ")
  const headingEnd = headingWords.slice(-1)[0]

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16 px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000" />

      <div className="max-w-6xl mx-auto relative">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            {badgeText}
          </div>
          <h2 className="text-2xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {headingStart}{" "}
            <span className="bg-gradient-to-r from-primary-400 to-primary-800 bg-primary bg-clip-text text-transparent">{headingEnd}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>
        </div>
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-5 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0  bg-primary" />
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{ctaHeading}</h3>
            <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
              {ctaDescription}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href={buttonLink}>
                <button className="group inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-blue-900 font-bold py-4 px-3 md:px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <CalendarDays className="w-5 h-5" />
                  {buttonText}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
