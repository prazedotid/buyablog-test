import React from 'react'

import prisma from '@/lib/prisma'
import ArticleCard from "@/app/ArticleCard";

async function getAllPosts() {
  return prisma.posts.findMany({
    include: {author: {select: {name: true}}},
  })
}

export default async function Home() {
  const posts = await getAllPosts()

  return (
    <div>
      {posts.map((post, index) => (
        <ArticleCard key={post.id} post={post}/>
      ))}
    </div>
  )
}
