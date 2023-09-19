'use client'

import { TwitterIcon, TwitterShareButton as ShareButton } from 'next-share'

interface Props {
  className: string
  url: string
  title: string
}

export default function Twitter({ className, url, title, ...props }: Props) {
  return (
    <div className={className}>
      <ShareButton
        url={url}
        title={title}
        {...props}
      >
        <TwitterIcon size={28} round />
      </ShareButton>
    </div>
  )
}