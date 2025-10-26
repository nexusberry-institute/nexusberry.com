import type { Metadata } from 'next'

import type { Media, Page, Post, Config, Department, WebCourse } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/logos/nxb-transpararnt-566x330.png'
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

  // ✅ Hardcoded keywords
  let keywords: string[] = ["NexusBerry", "Training", "Courses", "Education", "Solutions"]

  // Agar chaho to page type ke hisaab se bhi kar sakte ho:
  if ("courseName" in (doc || {})) {
    keywords = ["Courses", "Online Learning", "NexusBerry Training"]
  }
  if ("departmentName" in (doc || {})) {
    keywords = ["Departments", "Teams", "NexusBerry"]
  }

  return {
    description: doc?.meta?.description,

    keywords,
    // keywords: doc?.meta?.keywords
    //   ? Array.isArray(doc.meta.keywords)
    //     ? doc.meta.keywords
    //     : [doc.meta.keywords] // agar string ho to array bana do
    //   : ["NexusBerry", "Training", "Courses", "Education", "Solutions"],


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
