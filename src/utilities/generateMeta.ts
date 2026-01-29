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


// ... existing imports

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | Partial<Department> | Partial<WebCourse> | any | null | undefined
}): Promise<Metadata> => {
  const { doc } = args
  const serverUrl = getServerSideURL()
  const ogImage = getImageURL(doc?.meta?.image)

  // 1. Determine the URL Prefix based on the document properties
  let prefix = '' 
  
  if (doc?.slug) {
    // Check for Department pattern
    if ("departmentName" in doc) {
      prefix = '/departments'
    } 
    // Check for Course pattern
    else if ("courseTitle" in doc) {
      prefix = '/course'
    } 
    // Check for Post/Blog pattern
    else if ("content" in doc && !("courseTitle" in doc)) {
      prefix = '/blog'
    }
    // Check for Events pattern
    else if ("eventDate" in doc) {
      prefix = '/events'
    }
  }

  // 2. Build the Canonical URL cleanly
  // This ensures that if prefix is empty, we get /slug, otherwise /prefix/slug
  const slugPath = doc?.slug ? `${prefix}/${doc.slug}`.replace(/\/+/g, '/') : ''
  const canonicalUrl =
    (doc?.meta && typeof doc.meta === 'object' && 'canonical' in doc.meta && doc.meta.canonical?.trim()) ||
    (doc?.slug ? `${serverUrl}${slugPath}` : serverUrl)

  // 3. Keywords (Merging Global + Specific)
  let keywordsList = [
    "NexusBerry Training & Solutions", 
    "Online Learning Pakistan", 
    "IT Training Institute Lahore", 
    "NexusBerry Arfa Tower"
  ]

  if ("departmentName" in (doc || {})) {
    keywordsList = [`${doc.departmentName} Courses`, "NexusBerry Departments", ...keywordsList]
  }

  const title = doc?.meta?.title
    ? `${doc.meta.title} | NexusBerry Training & Solutions`
    : 'NexusBerry Training & Solutions'

  return {
    title,
    description: doc?.meta?.description,
    keywords: keywordsList.join(', '),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage ? [{ url: ogImage }] : undefined,
      title,
      url: canonicalUrl,
    }),
  }
}

// import type { Metadata } from 'next'

// import type { Media, Page, Post, Config, Department, WebCourse } from '../payload-types'

// import { mergeOpenGraph } from './mergeOpenGraph'
// import { getServerSideURL } from './getURL'

// const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
//   const serverUrl = getServerSideURL()

//   let url = serverUrl + '/logos/nxb-transpararnt-566x330.png'
//   if (image && typeof image === 'object' && 'url' in image) {
//     const ogUrl = image.url

//     url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
//   }

//   return url
// }

// export const generateMeta = async (args: {
//   doc: Partial<Page> | Partial<Post> | Partial<Department> | Partial<WebCourse> | null | undefined
// }): Promise<Metadata> => {
//   const { doc } = args

//   const ogImage = getImageURL(doc?.meta?.image)

//   const title = doc?.meta?.title
//     ? doc?.meta?.title + ' | NexusBerry Training & Solutions'
//     : 'NexusBerry Training & Solutions'

//   const canonicalUrl =
//     (typeof doc?.meta === 'object' && 'canonical' in doc.meta && doc.meta.canonical?.trim()) ||
//     (doc?.slug ? `${getServerSideURL()}/course/${doc.slug}` : undefined)

//   // ✅ Hardcoded keywords
//   let keywords = [
//     "NexusBerry Training & Solutions",
//     "Online Learning Pakistan",
//     "IT Training Institute Lahore",
//     "Professional Certifications Pakistan",
//     "AI and Data Science Courses",
//     "Web and Mobile App Development",
//     "Digital Marketing and SEO Courses",
//     "Creative Design and Video Editing",
//     "On-campus Training Lahore",
//     "Skill Development Pakistan",
//     "NexusBerry Arfa Tower",
//     "Generative AI Training"
//   ]

//   if ("departmentName" in (doc || {})) {
//     keywords = ["Departments", "Teams", "NexusBerry"]
//   }

//   return {
//     description: doc?.meta?.description,
//     keywords,
//     openGraph: mergeOpenGraph({
//       description: doc?.meta?.description || '',
//       images: ogImage
//         ? [
//           {
//             url: ogImage,
//           },
//         ]
//         : undefined,
//       title,
//       url: canonicalUrl || (Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/'),
//     }),
//     alternates: canonicalUrl
//       ? {
//         canonical: canonicalUrl,
//       }
//       : undefined,
//     title,
//   }
// }
