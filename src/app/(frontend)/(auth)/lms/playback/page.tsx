import { VideoPlayer } from './componentVideoPlayer'

// async function getVideos() {
//   const apiKey = process.env.BUNNY_API_KEY
//   const libraryId = process.env.BUNNY_LIBRARY_ID

//   if (!apiKey || !libraryId) {
//     throw new Error('Missing BunnyCDN configuration')
//   }

//   const response = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos`, {
//     headers: {
//       'Accept': 'application/json',
//       'AccessKey': apiKey
//     }
//   })

//   if (!response.ok) {
//     throw new Error('Failed to fetch videos')
//   }

//   return response.json()
// }

export default async function PlaybackPage() {
  // const videos = await getVideos()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Video Playback</h1>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.items.map((video: any) => (
          <div key={video.guid} className="border rounded p-4">
            <h2 className="text-lg font-semibold mb-2">{video.title}</h2>
            <VideoPlayer src={`https://${process.env.BUNNY_CDN_HOSTNAME}/${video.guid}/play_720p.mp4`} />
          </div>
        ))}
      </div> */}
    </div>
  )
}

