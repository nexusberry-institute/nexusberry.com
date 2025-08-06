'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { uploadVideo } from './actionUploadVideo'

export function VideoUpload() {
  const [file, setFile] = useState<File | undefined | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    setUploadStatus('Uploading...')

    try {
      const formData = new FormData()
      formData.append('file', file)
      const result = await uploadVideo(formData)
      setUploadStatus(result.success ? result.message : `Upload failed: ${result.message}`)
    } catch (error) {
      setUploadStatus(`Upload failed: ${error instanceof Error ? error.message : 'An unknown error occurred'}`)
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input type="file" onChange={handleFileChange} accept="video/*" />
      <Button type="submit" disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload Video'}
      </Button>
      {uploadStatus && <p className={uploadStatus.includes('failed') ? 'text-red-500' : 'text-green-500'}>{uploadStatus}</p>}
    </form>
  )
}

