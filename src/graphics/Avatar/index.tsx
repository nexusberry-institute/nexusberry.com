'use client'

import React from 'react'
import { useAuth } from '@payloadcms/ui'
import type { User, Media } from '@/payload-types'

export const Avatar = () => {
  const { user } = useAuth<User>()

  const photo = user?.photo as Media | null | undefined
  const url = photo?.url

  if (!url) {
    return (
      <svg
        className="graphic-account"
        height="25"
        viewBox="0 0 25 25"
        width="25"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle className="graphic-account__bg" cx="12.5" cy="12.5" r="11.5" />
        <circle className="graphic-account__head" cx="12.5" cy="10.73" r="3.98" />
        <path
          className="graphic-account__body"
          d="M12.5,24a11.44,11.44,0,0,0,7.66-2.94c-.5-2.71-3.73-4.8-7.66-4.8s-7.16,2.09-7.66,4.8A11.44,11.44,0,0,0,12.5,24Z"
        />
      </svg>
    )
  }

  return (
    <img
      alt={user?.email || 'User avatar'}
      height={25}
      src={url}
      style={{ borderRadius: '50%', objectFit: 'cover' }}
      width={25}
    />
  )
}
