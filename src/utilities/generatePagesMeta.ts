import type { Metadata } from 'next'
import type { Page, Media, Config } from '../payload-types'
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

export const generatePagesMeta = async (args: {
  doc: Partial<Page> | null | undefined
}): Promise<Metadata> => {
  const { doc } = args
  const serverUrl = getServerSideURL()
  const ogImage = getImageURL(doc?.meta?.image)

  const slugPath = doc?.slug ? `/${doc.slug}` : ''
  const canonicalUrl =
    (doc?.meta &&
      typeof doc.meta === 'object' &&
      'canonical' in doc.meta &&
      typeof (doc.meta as Record<string, unknown>).canonical === 'string' &&
      ((doc.meta as Record<string, unknown>).canonical as string).trim()) ||
    (doc?.slug ? `${serverUrl}${slugPath}` : serverUrl)

  const title = doc?.meta?.title
    ? `${doc.meta.title} | NexusBerry Training & Solutions`
    : 'NexusBerry Training & Solutions'

  return {
    title,
    description: doc?.meta?.description,
    keywords: [
      'NexusBerry Training & Solutions',
      'Online Learning Pakistan',
      'IT Training Institute Lahore',
      'NexusBerry Lahore Pakistan',
    ].join(', '),
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
