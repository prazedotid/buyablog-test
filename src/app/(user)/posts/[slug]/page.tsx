import { DateTime } from 'luxon'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import prisma from '@/lib/prisma'
import { mediumReadingTime } from '@/lib/util'
import SocialShare from './SocialShare'

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
    openGraph: {
      title: post.title,
      description: post.description,
      authors: post.author.name,
      images: post.imageUrl ?? undefined,
    }
  }
}

export default async function PostDetail({params}: PostDetailProps) {
  const post = await getPost(params.slug)
  if (!post) {
    return notFound()
  }

  return (
    <>
      {post.imageUrl && <img className="block rounded mb-7 h-full object-cover w-full" src={post.imageUrl} alt={'Post Image'}/>}

      <h1 className="font-extrabold text-4xl mb-2 leading-tight">{post.title}</h1>
      <h2 className="text-xl mb-7 text-gray-500 leading-7">{post.description}</h2>

      <div className="flex flex-column items-center mb-7">
        <img src="/avatar.jpg" alt="Profile Picture" className="h-12 w-12 mr-4 rounded-full"/>
        <div>
          <p className="mb-1">{post.author.name}</p>
          <p className="text-gray-500 text-sm">
            {mediumReadingTime(post.content)} &middot; {post.publishedAt && DateTime.fromJSDate(post.publishedAt).toFormat('MMM dd')}
          </p>
        </div>
      </div>

      <div id="socials" className="mb-7">
        <div className="w-full h-px bg-gray-200"></div>
        <SocialShare title={post.title} />
        <div className="w-full h-px bg-gray-200"></div>
      </div>

      <div className="text-gray-600">
        {post.content}
      </div>
    </>
  )
}