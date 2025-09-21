// "use client"
// import {
//     Pagination,
//     PaginationContent,
//     PaginationEllipsis,
//     PaginationItem,
//     PaginationLink,
//     PaginationNext,
//     PaginationPrevious,
// } from "@/components/ui/pagination"

// interface PayloadPaginationMeta {
//     totalDocs: number
//     limit: number
//     totalPages: number
//     page: number
//     pagingCounter: number
//     hasPrevPage: boolean
//     hasNextPage: boolean
//     prevPage: number | null
//     nextPage: number | null
// }

// interface PayloadPaginationProps {
//     meta: PayloadPaginationMeta
//     baseUrl?: string
//     searchParams?: Record<string, string | number | string[]>
// }

// export function PayloadPagination({
//     meta,
//     baseUrl = "",
//     searchParams = {},
// }: PayloadPaginationProps) {
//     const { page, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage, totalDocs, limit } = meta
//     // Function to create URL with query parameters
//     const createPageUrl = (pageNumber: number) => {
//         const params = new URLSearchParams()

//         // Add existing search params
//         Object.entries(searchParams).forEach(([key, value]) => {
//             if (key !== 'page') { // Don't include the current page param
//                 if (Array.isArray(value)) {
//                     value.forEach(v => params.append(key, v))
//                 } else {
//                     params.set(key, value as string)
//                 }
//             }
//         })

//         // Add the new page parameter
//         if (pageNumber > 1) {
//             params.set('page', pageNumber.toString())
//         }

//         const queryString = params.toString()
//         return `${baseUrl}${queryString ? `?${queryString}` : ''}`
//     }

//     // Generate page numbers to display
//     const getVisiblePages = () => {
//         const delta = 2 // Number of pages to show on each side of current page
//         const range = []
//         const rangeWithDots = []

//         for (
//             let i = Math.max(2, page - delta);
//             i <= Math.min(totalPages - 1, page + delta);
//             i++
//         ) {
//             range.push(i)
//         }

//         if (page - delta > 2) {
//             rangeWithDots.push(1, "...")
//         } else {
//             rangeWithDots.push(1)
//         }

//         rangeWithDots.push(...range)

//         if (page + delta < totalPages - 1) {
//             rangeWithDots.push("...", totalPages)
//         } else if (totalPages > 1) {
//             rangeWithDots.push(totalPages)
//         }

//         return rangeWithDots.filter((item, index, array) => {
//             // Remove duplicate 1s and totalPages
//             if (item === 1 && index > 0 && array[index - 1] === 1) return false
//             if (item === totalPages && index < array.length - 1 && array[index + 1] === totalPages) return false
//             return true
//         })
//     }

//     if (totalPages <= 1) return null

//     const visiblePages = getVisiblePages()

//     return (
//         <div className="flex flex-col items-center gap-4">
//             <div className="text-sm text-muted-foreground">
//                 Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalDocs)} of {totalDocs} results
//             </div>

//             <Pagination>
//                 <PaginationContent>
//                     {hasPrevPage && (
//                         <PaginationItem>
//                             <PaginationPrevious href={createPageUrl(prevPage || 1)} />
//                         </PaginationItem>
//                     )}

//                     {visiblePages.map((pageNumber, index) => (
//                         <PaginationItem key={index}>
//                             {pageNumber === "..." ? (
//                                 <PaginationEllipsis />
//                             ) : (
//                                 <PaginationLink
//                                     href={createPageUrl(pageNumber as number)}
//                                     isActive={pageNumber === page}
//                                 >
//                                     {pageNumber}
//                                 </PaginationLink>
//                             )}
//                         </PaginationItem>
//                     ))}

//                     {hasNextPage && (
//                         <PaginationItem>
//                             <PaginationNext href={createPageUrl(nextPage || totalPages)} />
//                         </PaginationItem>
//                     )}
//                 </PaginationContent>
//             </Pagination>
//         </div>
//     )
// }