import RichText from '@/components/RichText'
// import { WebCourse } from '@/payload-types'
import React from 'react'

const RenderRichText = ({ richText }: any) => {
  return (
    <div className="padding-y padding-x bg-card lg:border max-lg:border-y max-lg:shadow-none shadow-md lg:rounded-xl space-y-4 max-sm:space-y-2">
      {richText ? (
        <RichText data={richText} className="px-0 mx-0 min-w-full font-serif" />
      ) : (
        <h2 className='text-red-400'>{' '}</h2>
      )}
    </div>
  )
}

export default RenderRichText
