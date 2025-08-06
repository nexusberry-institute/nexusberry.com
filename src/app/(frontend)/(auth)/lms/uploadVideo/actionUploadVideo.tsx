'use server'

import { revalidatePath } from 'next/cache'

export async function uploadVideo(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) {
    throw new Error('No file provided')
  }

  const fileName = file.name
  const fileBuffer = await file.arrayBuffer()

  const apiKey = process.env.BUNNY_API_KEY
  const storageZone = process.env.BUNNY_STORAGE_ZONE_NAME
  const libraryId = process.env.BUNNY_LIBRARY_ID

  if (!apiKey || !storageZone || !libraryId) {
    console.error('Missing BunnyCDN configuration')
    throw new Error('Server configuration error')
  }

  try {
    // Step 1: Create the video in the library
    console.log('Creating video in library...')
    const createResponse = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'AccessKey': apiKey
      },
      body: JSON.stringify({ 
        title: fileName,
        collectionId: "f080877c-0e96-4a8c-9ded-58bde39c8a98" // Default collection
      })
    })

    if (!createResponse.ok) {
      const errorText = await createResponse.text()
      console.error('Failed to create video in library:', createResponse.status, errorText)
      throw new Error(`Failed to create video in library: ${createResponse.status} ${errorText}`)
    }

    const { guid } = await createResponse.json()
    console.log('Video created with GUID:', guid)

    // Step 2: Upload the video file
    console.log('Uploading video file...')
    const uploadResponse = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos/${guid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/octet-stream',
        'AccessKey': apiKey
      },
      body: fileBuffer
    })

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error('Failed to upload video file:', uploadResponse.status, errorText)
      throw new Error(`Failed to upload video file: ${uploadResponse.status} ${errorText}`)
    }

    console.log('Video uploaded successfully')
    revalidatePath('/playback')
    return { success: true, message: 'Video uploaded successfully' }
  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, message: error instanceof Error ? error.message : 'An unknown error occurred' }
  }
}