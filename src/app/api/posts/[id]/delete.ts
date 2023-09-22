import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getCurrentUser()
  if (!session) {
    return NextResponse.json('Unauthorized.', { status: 401 })
  }

  const post = await prisma.posts.findUnique({
    where: { id: params.id },
  })
  if (!post) {
    return NextResponse.json('Not found.', { status: 404 })
  }

  await prisma.posts.delete({
    where: { id: params.id }
  })

  return NextResponse.json({ success: true }, { status: 200 })
}