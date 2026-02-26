import { getPayload } from "payload"
import configPromise from "@payload-config"
import { Media, User } from "@/payload-types"
import { randomBytes } from "node:crypto"

export type UserProps = {
  id: string
  email: string,
  verified_email: boolean,
  name?: string
  password?: string
  picture?: string
}

export const getUserByEmail = async (data: UserProps): Promise<User> => {
  const payload = await getPayload({ config: configPromise })

  const email = data.email
  const result = await payload.find({
    collection: "users", // required
    depth: 1,
    page: 1,
    limit: 1,
    pagination: false, // If you want to disable pagination count, etc.
    where: {
      email: {
        equals: email,
      },
    },
  })

  if (result.totalDocs === 0) {
    return await createUser(data)
  }

  const existingUser = result.docs[0]!

  // Update provider to 'google' and ensure verified
  if (existingUser.provider !== 'google' || !existingUser._verified) {
    const updated = await payload.update({
      collection: 'users',
      id: existingUser.id,
      data: {
        provider: 'google',
        _verified: true,
        ...(existingUser.provider !== 'google' && !existingUser.gmail_username
          ? { gmail_username: data.name }
          : {}),
      },
    })
    return updated
  }

  return existingUser
}

export const createUser = async (props: UserProps) => {
  const payload = await getPayload({ config: configPromise })
  const password = randomBytes(16).toString("hex")

  // const profilePicture = await uploadImageByUrl(props.picture)

  const user = await payload.create({
    collection: "users",
    data: {
      // photo: profilePicture,
      gmail_username: props.name,
      provider: "google",
      email: props.email,
      password: props.password ?? password,
      _verified: true,
    },
  })

  return user
}

export const loginWith = async (user: User) => {
  const payload = await getPayload({ config: configPromise })
  const collectionConfig = payload.collections['users'].config

  if (!collectionConfig.auth) {
    throw new Error("Collection is not used for authentication")
  }

  // Use payload.login() — the exact same code path as local login
  // Set a temp password since we can't read the hashed one
  const tempPassword = randomBytes(32).toString("hex")

  await payload.update({
    collection: 'users',
    id: user.id,
    data: { password: tempPassword },
    overrideAccess: true,
  })

  const result = await payload.login({
    collection: 'users',
    data: {
      email: user.email,
      password: tempPassword,
    },
    overrideAccess: true,
  })

  if (!result.token) {
    throw new Error("Failed to generate authentication token")
  }

  return {
    name: `${payload.config.cookiePrefix}-token`,
    value: result.token,
    tokenExpiration: collectionConfig.auth.tokenExpiration,
  }
}

export const uploadImageByUrl = async (imageUrl?: string): Promise<Media | null> => {
  try {

    if (!imageUrl) {
      return null;
    }
    // Add timeout to prevent hanging on slow responses
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const res = await fetch(imageUrl, {
      signal: controller.signal,
      headers: {
        // Add user agent to prevent some servers from blocking the request
        'User-Agent': 'Mozilla/5.0 (compatible; NexusBerry/1.0)'
      }
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(`Failed to fetch image: ${res.status} ${res.statusText}`);
      return null;
    }

    // Extract filename from URL or generate a unique one
    const urlObj = new URL(imageUrl);
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);
    const fileNameFromUrl = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] || "" : "";

    // Clean up the filename and ensure it has an extension
    const fileName = fileNameFromUrl.replace(/[^a-zA-Z0-9._-]/g, '') ||
      `image-${Date.now()}.jpg`;

    // Get the correct content type or default to jpeg
    const contentType = res.headers.get('content-type') || 'image/jpeg';

    const buffer: Buffer = await res.arrayBuffer().then(arrayBuffer =>
      Buffer.from(arrayBuffer)
    );

    // Validate that we actually got an image
    if (buffer.length === 0) {
      console.error('Received empty buffer from image URL');
      return null;
    }

    // Upload to Payload CMS
    const payload = await getPayload({ config: configPromise })
    const uploaded = await payload.create({
      collection: 'media',
      data: {
        alt: fileName,
      },
      file: {
        name: fileName,
        data: buffer,
        size: buffer.length,
        mimetype: contentType,
      },
    });

    return uploaded;
  } catch (error) {
    console.error('Error uploading image from URL:', error);
    return null;
  }
}


