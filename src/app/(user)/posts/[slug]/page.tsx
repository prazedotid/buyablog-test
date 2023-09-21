import { DateTime } from 'luxon'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import Facebook from '@/components/share-buttons/Facebook'
import Linkedin from '@/components/share-buttons/Linkedin'
import Twitter from '@/components/share-buttons/Twitter'
import prisma from '@/lib/prisma'

interface PostDetailProps {
  params: {
    slug: string
  }
}

async function getPost(slug: string) {
  const post = await prisma.posts.findUnique({
    where: {slug},
    include: {author: {select: {name: true}}},
  })
  if (!post) {
    return null
  }

  return post
}

export async function generateMetadata({params}: PostDetailProps): Promise<Metadata> {
  const post = await getPost(params.slug)
  if (!post) {
    return {}
  }

  return {
    title: post.title,
    description: post.description,
  }
}

export default async function PostDetail({params}: PostDetailProps) {
  const post = await getPost(params.slug)
  if (!post) {
    return notFound()
  }

  return (
    <>
      <img className="block rounded mb-7 w-full" src={post.imageUrl} alt={'Post Image'}/>

      <h1 className="font-extrabold text-4xl mb-2 leading-tight">{post.title}</h1>
      <h2 className="text-xl mb-7 text-gray-500 leading-7">{post.description}</h2>

      <div className="flex flex-column items-center mb-7">
        <img src="/avatar.jpg" alt="Profile Picture" className="h-12 w-12 mr-4 rounded-full"/>
        <div>
          <p className="mb-1">{post.author.name}</p>
          <p className="text-gray-500 text-sm">
            {post.readingTime} &middot; {DateTime.fromJSDate(post.publicationDate).toFormat('MMM dd')}
          </p>
        </div>
      </div>

      <div id="socials" className="mb-7">
        <div className="w-full h-px bg-gray-200"></div>
        <div className="flex flex-column items-center justify-end py-3">
          <div className="text-sm text-gray-500 mr-3">Share on</div>

          <Facebook url={'https://github.com/next-share'} className="flex mr-2" quote={post.title}/>
          <Twitter url={'https://github.com/next-share'} className="flex mr-2" title={post.title}/>
          <Linkedin url={'https://github.com/next-share'} className="flex"/>
        </div>
        <div className="w-full h-px bg-gray-200"></div>
      </div>

      <div className="text-gray-600">
        {post.content}
      </div>
    </>
  )
}