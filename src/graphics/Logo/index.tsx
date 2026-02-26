import React from 'react'
import Image from 'next/image'

export const Logo = () => {
  return (
    <a href="/" style={{ display: 'block' }}>
      <Image
        src="/logos/nexusberry-whitebg-1914x468.png"
        alt="NexusBerry Training & Solutions"
        width={300}
        height={73}
        priority
      />
    </a>
  )
}
