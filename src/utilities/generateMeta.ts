import type { Metadata } from 'next'

import type { Media, Page, Post, Config, Department, WebCourse } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'
  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | Partial<Department> | Partial<WebCourse> | null | undefined
}): Promise<Metadata> => {
  const { doc } = args

  const ogImage = getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title
    ? doc?.meta?.title + ' | NexusBerry Training & Solutions'
    : 'NexusBerry Training & Solutions'

  const canonicalUrl =
    (typeof doc?.meta === 'object' && 'canonical' in doc.meta && doc.meta.canonical?.trim()) ||
    (doc?.slug ? `${getServerSideURL()}/courses/${doc.slug}` : undefined)

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
          {
            url: ogImage,
          },
        ]
        : undefined,
      title,
      url: canonicalUrl || (Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/'),
    }),
    alternates: canonicalUrl
      ? {
        canonical: canonicalUrl,
      }
      : undefined,
    title,
  }
}
