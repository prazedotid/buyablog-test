'use client'

import { LinkedinIcon, LinkedinShareButton as ShareButton } from 'next-share'

interface Props {
  className: string
  url: string
}

export default function Linkedin({ className, url, ...props }: Props) {
  return (
    <div className={className}>
      <ShareButton
        url={url}
        {...props}
      >
        <LinkedinIcon size={28} round/>
      </ShareButton>
    </div>
  )
}