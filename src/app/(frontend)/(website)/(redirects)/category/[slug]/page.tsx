import { PayloadRedirects } from '@/components/PayloadRedirects'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const fromUrl = '/category/' + slug

  return (
    <PayloadRedirects url={fromUrl} />
  )
}