import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <a href="/" target="_blank"> Welcome NexusBerry Training & Solutions! </a>
      </Banner>
    </div>
  )
}

export default BeforeDashboard
