import PostForm from '../PostForm'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

interface UpdatePostProps {
  params: {
    id: string
  }
}

export const metadata = {
  title: 'Update Post | Buyablog Admin Panel',
}

export default async function UpdatePost({ params }: UpdatePostProps) {
  const post = await prisma.posts.findUnique({ where: { id: params.id } })
  if (!post) {
    notFound()
  }

  return <PostForm post={post} />
}