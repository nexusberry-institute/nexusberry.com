import React from 'react'
import Link from 'next/link'
import { Youtube, Twitter, Instagram, Facebook, Linkedin } from 'lucide-react'
import { Footer } from '@/payload-types'

export default function SocialLinks({ socialLinks }: {
  socialLinks: Footer['socialLinks']
}) {
  const icon = {
    youtube: <Youtube size={20} className="stroke-background group-hover:stroke-red-500 " />,
    twitter: (
      <Twitter
        size={20}
        className="fill-background stroke-background group-hover:stroke-primary-400 hover:fill-primary-400 "
      />
    ),
    instagram: <Instagram size={20} className=" stroke-background group-hover:stroke-red-400 " />,
    linkedin: (
      <Linkedin
        size={20}
        strokeWidth={1}
        className="stroke-background fill-background group-hover:stroke-primary-400 group-hover:fill-primary-400 "
      />
    ),
    facebook: (
      <Facebook
        size={20}
        strokeWidth={1}
        className="stroke-background fill-background group-hover:stroke-primary-400 group-hover:fill-primary-400"
      />
    ),
  }

  return (
    <ul className="flex gap-4">
      {socialLinks?.map((link, index) => (
        <li
          key={index}
          className="px-1 rounded-full ring-1 ring-background py-1 hover:bg-background group"
        >
          <Link href={link.link || "#"} aria-label={`go to ${link.platform}`}>
            {icon[link.platform as keyof typeof icon || "youtube"]}
          </Link>
        </li>
      ))}
    </ul>
  )


}
