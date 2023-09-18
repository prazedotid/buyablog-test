'use client'

import { FacebookIcon, FacebookShareButton as ShareButton } from 'next-share'

interface Props {
  className: string
  url: string
  quote: string
}

export default function Facebook({ className, url, quote, ...props }: Props) {
  return (
    <div className={className}>
      <ShareButton
        url={url}
        quote={quote}
        {...props}
      >
        <FacebookIcon size={28} round />
      </ShareButton>
    </div>
  )
}