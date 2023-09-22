import React from 'react'

import prisma from '@/lib/prisma'
import ArticleCard from './ArticleCard'

async function getAllPublishedPosts() {
  return prisma.posts.findMany({
    where: {
      publishedAt: {
        lt: new Date(),
      },
      NOT: {
        publishedAt: null,
      }
    },
    include: {
      author: {select: {name: true}},
      category: {select: {name: true}},
    },
  })
}

export default async function Home() {
  const posts = await getAllPublishedPosts()

  return (
    <div>
      {posts.map((post) => (
        <ArticleCard key={post.id} post={post}/>
      ))}
    </div>
  )
}
