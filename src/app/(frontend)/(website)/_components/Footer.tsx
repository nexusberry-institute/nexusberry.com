import React from 'react'
import Image from 'next/image'
import SocialLinks from './SocialLinks'
import FooterResources from './FooterResources'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { placeholderImg } from '@/app/(frontend)/(website)/_assets/images'
import {
  Facebook,
  Youtube,
  Twitter,
  Instagram,
  Linkedin,
  Globe
} from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  facebook: Facebook,
  youtube: Youtube,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  website: Globe,
}

type SocialLink = {
  platform: string | null
  link: string | null
}

const getFooter = unstable_cache(async () => {
  const payload = await getPayload({ config })
  const footer = await payload.findGlobal({
    slug: "footer",
    depth: 1,
    select: {
      navItems: false,
    }
  })
  return footer;
}, ['global_footer'], { tags: ["global_footer"] })


export default async function Footer() {

  try {
    const footerContent = await getFooter()
    const socialLinks = footerContent.socialLinks || []
    if (!Object.keys(footerContent).length) {
      return (
        <div className="text-2xl text-center font-bold py-6 text-red-500">
          footer content not set yet
        </div>
      )
    }

    return (
      <footer className="bg-primary  py-10 text-background lg:px-10 px-4 ">
        <div className="container mx-auto lg:space-y-8 space-y-4">
          <div className="grid grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-xs:grid-cols-1 sm:py-10 max-xs:px-4  gap-10 ">
            <div className="space-y-6  max-lg:col-span-3 max-md:col-span-2 max-xs:col-span-1">
              <div className="w-56 aspect-[4/1] relative">
                <Image
                  src={typeof footerContent.logo === "object" ? footerContent.logo?.url ?? placeholderImg : placeholderImg}
                  alt={typeof footerContent.logo === "object" ? footerContent.logo?.alt ?? "Nexusberry Logo" : "Nexusberry Logo"}
                  fill
                  className="object-cover"
                  sizes="224px"
                />
              </div>
              <p className="lg:text-sm  leading-7 font-semibold">
                {footerContent.companyDescription || 'NexusBerry provides cutting-edge training and solutions for modern technology needs.'}
              </p>
              <div className='flex'>
                {footerContent.socialLinks?.map(({ platform, link }, index) => {
                  // Skip if platform or link is empty
                  if (!platform || !link || typeof link !== 'string' || link.trim() === '') return null;
                  const Icon = iconMap[(platform ?? '').toLowerCase()] || Globe;
                  return (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition"
                      aria-label={platform}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                    </a>
                  );
                })}
              </div>
            </div>
            {footerContent?.footerCols?.length == 0 ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-6 bg-background/20 rounded w-24"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-background/20 rounded w-32"></div>
                  <div className="h-4 bg-background/20 rounded w-28"></div>
                  <div className="h-4 bg-background/20 rounded w-36"></div>
                </div>
              </div>
            ) : (
              footerContent.footerCols?.map((col, index) => (
                <div className="lg:space-y-6 space-y-4" key={index}>
                  <h2 className="font-semibold">{col.colTitle}</h2>
                  <ul className="lg:space-y-2 space-y-2 ">
                    {!col.rows?.length
                      ? 'links not fount'
                      : col.rows?.map((row, ind) => (
                        <li
                          key={ind}
                          className="lg:text-sm  w-fit group text-background leading-6 "
                        >
                          <Link href={row.href || '#'} aria-label={`go to ${row.rowTitle}`}>
                            {row.rowTitle}
                          </Link>
                          <div className="h-[2px] w-0 group-hover:w-full bg-secondary-500 duration-500"></div>
                        </li>
                      ))}
                  </ul>
                </div>
              ))
            )}
          </div>
          <hr />
          <FooterResources />
          <div>
            <p className="text-center text-[12px] lg:text-sm  leading-4">
              © Copyright 2025, All Rights Reserved By NexusBerry Training & Solutions
            </p>
          </div>
        </div>
      </footer>
    )
  } catch (error) {
    return <footer className="bg-primary py-10 text-background lg:px-10 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center py-10">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-lg mx-auto" role="alert">
            <strong className="font-bold">Error loading footer:</strong>
            <span className="block sm:inline ml-2">{error instanceof Error ? error.message : String(error)}</span>
            <p className="mt-2 text-sm">Please try refreshing the page or contact support if the issue persists.</p>
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-[12px] lg:text-sm leading-4">
            © Copyright {new Date().getFullYear()}, All Rights Reserved By NexusBerry Training and Solutions
          </p>
        </div>
      </div>
    </footer>
  }
}
