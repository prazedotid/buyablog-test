import Link from 'next/link'
import { DateTime } from 'luxon'
import React from 'react'

interface Props {
  post: {
    slug: string | null
    title: string
    description: string
    author: {
      name: string
    }
    category: {
      name: string
    }
    publishedAt: string | null
    imageUrl: string | null
  }
}

export default function ArticleCard({ post, ...props }: Props) {
  return (
    <article className="py-4 border-b" {...props}>
      <div className="flex flex-column gap-2 mb-1.5">
        <div className="text-xs text-pink-500 font-bold">{post.category.name}</div>
      </div>

      <div className="flex flex-column justify-between">
        <div className="flex-1 pr-4">
          <Link href={`/posts/${post.slug}`}>
            <h1 className="text-gray-800 mb-1 text-lg font-bold tracking-tight leading-normal">
              {post.title}
            </h1>
            <p className="text-gray-600 mb-3 text-sm leading-relaxed">{post.description}</p>
          </Link>
          <p className="text-gray-600 text-xs leading-relaxed">
            <span className="mr-1">{post.author.name}</span>
            <span className="mr-1">&middot;</span>
            {post.publishedAt && <Link href={`/posts/${post.slug}`}>
              {DateTime.fromISO(post.publishedAt).toFormat('MMMM dd, yyyy')}
            </Link>}
          </p>
        </div>
        {post.imageUrl && <Link href={`/posts/${post.slug}`} className="w-28">
            <img className="w-full h-full rounded object-cover block" src={post.imageUrl} alt="Post Image"/>
        </Link>}
      </div>
    </article>
  )
}