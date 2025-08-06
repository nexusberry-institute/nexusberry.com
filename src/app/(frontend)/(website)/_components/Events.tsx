import { CalendarDays, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default function Events() {


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
            Upcoming Events
          </div>
          <h2 className="text-2xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Discover Amazing
            <span className="bg-gradient-to-r from-primary-400 to-primary-800 bg-primary bg-clip-text text-transparent"> Events</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of professionals at our carefully curated events designed to inspire, educate, and connect.
          </p>
        </div>
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-5 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0  bg-primary" />
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Join the Experience?</h3>
            <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
              Do not miss out on networking opportunities, expert insights, and unforgettable experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/events">
                <button className="group inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-blue-900 font-bold py-4 px-3 md:px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <CalendarDays className="w-5 h-5" />
                  Explore All Events
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


// import { CalendarDays, ArrowRight, Sparkles } from "lucide-react";
// import Link from "next/link";
// import { getGlobalEventData } from "@/lib/getGlobalEventData";

// export default async function Events() {
//   const data = await getGlobalEventData();

//   if (!data?.showEventCTA) return null; // Optionally hide if disabled in CMS

//   return (
//     <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16 px-6 relative overflow-hidden">
//       {/* Background blobs */}
//       <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
//       <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000" />

//       <div className="max-w-6xl mx-auto relative">
//         {/* Header */}
//         <div className="text-center mb-12">
//           {data.ctaBadgeText && (
//             <div className="inline-flex items-center gap-2 bg-blue-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
//               <Sparkles className="w-4 h-4" />
//               {data.ctaBadgeText}
//             </div>
//           )}
//           <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
//             {data.ctaTitle?.split(" ").slice(0, -1).join(" ")}{" "}
//             <span className="bg-gradient-to-r from-primary-400 to-primary-800 bg-primary bg-clip-text text-transparent">
//               {data.ctaTitle?.split(" ").slice(-1)}
//             </span>
//           </h2>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//             {data.ctaDescription}
//           </p>
//         </div>

//         {/* CTA Button Section */}
//         <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
//           <div className="absolute inset-0 bg-primary" />
//           <div className="relative z-10">
//             <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
//               Ready to Join the Experience?
//             </h3>
//             <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
//               Don&apos;t miss out on networking opportunities, expert insights, and unforgettable experiences.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//               <Link href={data.ctaButtonLink || "/events"}>
//                 <button className="group inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-blue-900 font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
//                   <CalendarDays className="w-5 h-5" />
//                   {data.ctaButtonText || "Explore All Events"}
//                   <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                 </button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
