import React from 'react'

import prisma from '@/lib/prisma'
import ArticleCard from '@/components/ArticleCard'

async function getAllPosts() {
  return prisma.posts.findMany({
    include: {author: {select: {name: true}}},
  })
}

export default async function Home() {
  const posts = await getAllPosts()

  return (
    <div>
      {posts.map((post) => (
        <ArticleCard key={post.id} post={post}/>
      ))}
    </div>
  )
}