import { VideoUpload } from './componentVideoUpload'
import Link from 'next/link'




export default function LMSHome() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Video Upload</h1>
      <VideoUpload />
      <div className="mt-4">
        <Link href="/lms/playback" className="text-blue-500 hover:underline">
          Go to Video Playback
        </Link>
      </div>
    </div>
  )
}