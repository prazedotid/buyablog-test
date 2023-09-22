'use client'

import React, { useEffect, useState } from 'react'

import Facebook from '@/components/share-buttons/Facebook'
import Twitter from '@/components/share-buttons/Twitter'
import Linkedin from '@/components/share-buttons/Linkedin'

export default function SocialShare({ title }: { title: string }) {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.href)
    }
  }, [])

  return (
    <div className="flex flex-column items-center justify-end py-3">
      <div className="text-sm text-gray-500 mr-3">Share on</div>

      {url && (
        <>
          <Facebook url={url} className="flex mr-2" quote={title}/>
          <Twitter url={url} className="flex mr-2" title={title}/>
          <Linkedin url={url} className="flex"/>
        </>
      )}
    </div>
  )
}