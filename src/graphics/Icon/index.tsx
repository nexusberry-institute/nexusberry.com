import React from 'react'
import Image from 'next/image'
export const Icon = () => {
  return (
    <div className="w-8 h-8">
      <Image
        src="/icons/favi.jpg"
        alt="NexusBerry Logo Icon"
        width={32}
        height={32}
      />
    </div>
  )
}
