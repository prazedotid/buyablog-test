import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.categories.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true
      }
    })

    return NextResponse.json({ data: categories })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}