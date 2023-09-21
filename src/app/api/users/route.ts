import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/session'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const sessionUser = await getCurrentUser()
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 })
    }

    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
      }
    })

    return NextResponse.json({ data: users })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}