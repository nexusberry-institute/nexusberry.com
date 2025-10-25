"use server"

import { getPayload } from "payload";
import config from "@payload-config";
import { buffer } from "stream/consumers";

export async function studentImageUpload(studentId: number, image: File) {

  try {

    const BufferImage = Buffer.from(await image.arrayBuffer());

    const payload = await getPayload({ config });

    const uploadedImage = await payload.create({
      collection: "media",
      data: {
        alt: "Profile Picture ",
        mimeType: image.type,
        filename: image.name,
        filesize: image.size,
      },
      file: {
        data: BufferImage,
        size: image.size,
        name: image.name.replace(/[^a-zA-Z0-9_.-]/g, '_'),
        mimetype: image.type,
      },
    });

    await payload.update({
      collection: "students",
      id: studentId,
      data: {
        profilePicture: uploadedImage.id
      }
    })

    return {
      success: true,
      message: "Your profile image has been updated",
    }

  } catch (error) {
    console.error("Error uploading image", error)
    return {
      success: false,
      message: "Failed to update profile image. Check your internet connection and try again.",
    }
  }
}