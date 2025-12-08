export default function VideoList() {
  return <div> Video List </div>
}


// // components/VideoList.tsx
// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { Video } from '@/payload-types'

// export default function VideoList() {
//   const [videos, setVideos] = useState<Video[]>([])
//   const [loading, setLoading] = useState(true)
//   const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         console.log('Fetching videos...')
//         const res = await fetch('/api/videos?limit=50&sort=-createdAt')
//         const data = await res.json()

//         console.log('API Response:', data)

//         if (data.docs && Array.isArray(data.docs)) {
//           // Process each video to extract title from rich text
//           const processedVideos = data.docs.map((video: any) => {
//             console.log('Processing video:', video.id, 'Title structure:', video.title)

//             return {
//               ...video,
//               // Extract title text from rich text
//               _extractedTitle: extractTextFromRichText(video.title),
//               // Get poster URL
//               _posterUrl: getPosterUrl(video.poster),
//             }
//           })

//           console.log('Processed Videos:', processedVideos)
//           setVideos(processedVideos)

//           if (processedVideos.length > 0) {
//             setSelectedVideoId(processedVideos[0].id)
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching videos:', error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchVideos()
//   }, [])

//   // YouTube thumbnail URL generate function
//   const getYouTubeThumbnail = (url: string) => {
//     if (!url || typeof url !== 'string') return null

//     try {
//       const youtubeId = url.match(
//         /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
//       )

//       if (youtubeId && youtubeId[1]) {
//         return `https://img.youtube.com/vi/${youtubeId[1]}/hqdefault.jpg`
//       }
//     } catch (error) {
//       console.error('Error extracting YouTube thumbnail:', error)
//     }
//     return null
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64" >
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" > </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6" >
//       <div className="max-w-7xl mx-auto">

//         {/* Main Content */}
//         {videos.length === 0 ? (
//           <div className="text-center py-12" >
//             <p className="text-gray-600 text-lg" > No videos found.</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" >

//             {/* Video List Sidebar */}
//             < div className="space-y-4" >
//               <div className="bg-white rounded-xl shadow p-4" >
//                 <h2 className="text-xl font-semibold mb-4 text-gray-800" >
//                   All Videos({videos.length})
//                 </h2>

//                 <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2" >
//                   {videos.map((video) => {
//                     const videoId = video.id
//                     const videoTitle = video.title || 'Untitled Video'
//                     const videoUrl = video.videoUrl || ''
//                     const thumbnailUrl = video.poster || getYouTubeThumbnail(videoUrl)

//                     return (
//                       <Link href={`/videos/${video.slug}`
//                       } key={videoId}>
//                         <div
//                           key={videoId}
//                           // onClick={() => setSelectedVideoId(videoId)}
//                           className={`p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-all ${selectedVideoId === videoId ? 'ring-2 ring-blue-500 bg-blue-50' : ''
//                             }`}
//                         >
//                           <div className="flex gap-3" >
//                             {/* Thumbnail */}
//                             < div className="shrink-0" >
//                               {
//                                 thumbnailUrl ? (
//                                   <img
//                                     src={thumbnailUrl}
//                                     alt={videoTitle}
//                                     className="w-20 h-12 object-cover rounded"
//                                   />
//                                 ) : (
//                                   <div className="w-20 h-12 bg-gray-300 rounded flex items-center justify-center">
//                                     <svg
//                                       className="w-6 h-6 text-gray-500"
//                                       fill="currentColor"
//                                       viewBox="0 0 20 20"
//                                     >
//                                       <path
//                                         fillRule="evenodd"
//                                         d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
//                                         clipRule="evenodd"
//                                       />
//                                     </svg>
//                                   </div>
//                                 )
//                               }
//                             </div>

//                             {/* Video Info */}
//                             <div className="flex-1 min-w-0" >
//                               <h3 className="font-medium text-gray-800 truncate" > {videoTitle} </h3>
//                               < p className="text-xs text-gray-500 mt-1" >
//                                 {new Date(video.createdAt).toLocaleDateString()}
//                               </p>
//                               {
//                                 videoUrl.includes('youtube') && (
//                                   <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded" >
//                                     YouTube
//                                   </span>
//                                 )
//                               }
//                             </div>
//                           </div>
//                         </div>
//                       </Link>
//                     )
//                   })
//                   }
//                 </div>
//               </div>
//             </div>
//           )}

//           </div>
//     </div>
//       )
// }

// // Function to extract text from rich text (Lexical) format
// const extractTextFromRichText = (richText: any): string => {
//   if (!richText) return 'Untitled Video'

//       // If it's already a string
//       if (typeof richText === 'string') {
//     return richText.trim() || 'Untitled Video'
//   }

//       // If it's a rich text object (Lexical format)
//       if (richText && typeof richText === 'object') {
//     try {
//       // Check for root.children structure
//       if (richText.root && richText.root.children && Array.isArray(richText.root.children)) {
//         let text = ''

//         // Recursively extract text from children
//         const extractFromChildren = (children: any[]) => {
//         children.forEach((child) => {
//           // Text node
//           if (child.text) {
//             text += child.text
//           }
//           // Nested children
//           if (child.children && Array.isArray(child.children)) {
//             extractFromChildren(child.children)
//           }
//         })
//       }

//       extractFromChildren(richText.root.children)
//       return text.trim() || 'Untitled Video'
//       }

//       // If direct text property exists
//       if (richText.text) {
//         return richText.text
//       }

//       // Try to stringify and parse
//       const jsonString = JSON.stringify(richText)
//       if (jsonString.includes('"text"')) {
//         const matches = jsonString.match(/"text":"([^"]+)"/g)
//       if (matches) {
//           return matches
//             .map((m) => m.replace(/"text":"([^"]+)"/, '$1'))
//       .join(' ')
//       .trim()
//         }
//       }
//     } catch (error) {
//         console.error('Error extracting text from rich text:', error)
//       }
//   }

//       // Fallback
//       return 'Untitled Video'
// }

// // Function to get thumbnail/poster URL
// const getPosterUrl = (poster: any): string | null => {
//   if (!poster) return null

//       // If poster has url property
//       if (poster.url) return poster.url

//       // If poster is an array with first element having url
//       if (Array.isArray(poster) && poster[0]?.url) {
//     return poster[0].url
//   }

//       // If it's an object with filename
//       if (poster.filename) {
//     // Construct URL - adjust based on your setup
//     return `/media/${poster.filename}`
//   }

//       return null
// }
