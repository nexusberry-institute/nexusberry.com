import payload, { getCookieExpiration, getFieldsToSign, getPayload } from "payload"
import configPromise from "@payload-config"
import { Media, User } from "@/payload-types"
import { cookies } from "next/headers"
import { SignJWT } from "jose"
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

  const user = result.totalDocs === 0 ? await createUser(data) : result.docs.at(0)!
  return user
}

export const createUser = async (props: UserProps) => {
  const payload = await getPayload({ config: configPromise })
  const password = randomBytes(16).toString("hex")

  // const profilePicture = await uploadImageByUrl(props.picture)

  const user = await payload.create({
    collection: "users",
    data: {
      id: Number(props.id),
      // photo: profilePicture,
      gmail_username: props.name,
      provider: "google",
      email: props.email,
      password: props.password ?? password,
      roles: ["student"],
      _verified: true,
    },
  })

  return user
}

export type UserWithCollection = User & { collection: "users" }

export const loginWith = async (user: User) => {
  const cookieStore = await cookies()
  const payload = await getPayload({ config: configPromise })
  const userWithCollection: UserWithCollection = {
    ...user,
    collection: "users",
  }

  const collectionConfig =
    payload.collections[userWithCollection.collection].config

  if (!collectionConfig.auth) {
    throw new Error("Collection is not used for authentication")
  }

  const secret = payload.secret
  const fieldsToSign = getFieldsToSign({
    collectionConfig,
    email: userWithCollection.email,
    user: userWithCollection,
  })

  const name = `${payload.config.cookiePrefix}-token`
  const expires = getCookieExpiration({
    seconds: collectionConfig.auth.tokenExpiration,
  })

  const secretKey = new TextEncoder().encode(secret)
  const issuedAt = Math.floor(Date.now() / 1000)
  const exp = issuedAt + collectionConfig.auth.tokenExpiration

  const token = await new SignJWT(fieldsToSign)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(issuedAt)
    .setExpirationTime(exp)
    .sign(secretKey)

  cookieStore.set({
    name,
    value: token,
    expires,
    httpOnly: true,
  })
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


