// EventCardSkeleton.tsx - Matches your exact design
import React from 'react'

const EventCardSkeleton = () => {
    return (
        <div className="space-y-2 ring-2 ring-foreground rounded-xl bg-card animate-pulse">
            {/* Image Skeleton - matches your aspect-[858/432] */}
            <div className="w-full aspect-[858/432] relative bg-gray-300 rounded-xl">
                {/* Image placeholder icon */}
                <div className="absolute inset-0 flex items-center justify-center"></div>
            </div>

            {/* Content Area - matches your p-4 flex flex-col structure */}
            <div className="space-y-4 p-4 flex flex-col">
                {/* Title Skeleton - matches h-14 line-clamp-2 */}
                <div className="h-14 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-4/5"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/5"></div>
                </div>

                {/* Date and Time Section - matches your space-y-3 */}
                <div className="space-y-3">
                    {/* Date with Calendar icon */}
                    <div className="flex items-center gap-2">
                        <div className="w-[18px] h-[18px] bg-gray-300 rounded-sm"></div>
                        <div className="h-3.5 bg-gray-300 rounded w-28"></div>
                    </div>

                    {/* Time with Clock icon */}
                    <div className="flex items-center gap-2">
                        <div className="w-[18px] h-[18px] bg-gray-300 rounded-full"></div>
                        <div className="h-3.5 bg-gray-300 rounded w-24"></div>
                    </div>
                </div>

                {/* Button Skeleton - matches your full width rounded-xl button */}
                <div className="w-full h-10 bg-gray-300 rounded-xl border-2 border-gray-400"></div>
            </div>
        </div>
    )
}

// Grid Skeleton for multiple cards
const EventsGridSkeleton = ({ count = 15 }: { count?: number }) => {
    return (
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 px-4 lg:px-10 gap-8 mb-8">
            {Array.from({ length: count }, (_, i) => (
                <EventCardSkeleton key={`event-skeleton-${i}`} />
            ))}
        </div>
    )
}

// Enhanced version with shimmer effect
const EventCardSkeletonWithShimmer = () => {
    return (
        <div className="space-y-2 ring-2 ring-gray-200 rounded-xl bg-card relative overflow-hidden">
            {/* Shimmer overlay */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            {/* Image Skeleton */}
            <div className="w-full aspect-[858/432] relative bg-gray-300 rounded-xl">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex space-x-1 opacity-40">
                        <div className="w-8 h-6 border-2 border-gray-400 rounded-sm bg-gray-200"></div>
                        <div className="w-8 h-6 border-2 border-gray-400 rounded-sm bg-gray-200 transform translate-x-1 -translate-y-0.5"></div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="space-y-4 p-4 flex flex-col">
                {/* Title */}
                <div className="h-14 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-4/5"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/5"></div>
                </div>

                {/* Date and Time */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="w-[18px] h-[18px] bg-gray-300 rounded-sm"></div>
                        <div className="h-3.5 bg-gray-300 rounded w-28"></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-[18px] h-[18px] bg-gray-300 rounded-full"></div>
                        <div className="h-3.5 bg-gray-300 rounded w-24"></div>
                    </div>
                </div>

                {/* Button */}
                <div className="w-full h-10 bg-gray-300 rounded-xl border-2 border-gray-400"></div>
            </div>
        </div>
    )
}

export { EventCardSkeleton, EventsGridSkeleton, EventCardSkeletonWithShimmer }
export default EventCardSkeleton

// Add this CSS to your globals.css for shimmer effect (optional)
/*
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
*/