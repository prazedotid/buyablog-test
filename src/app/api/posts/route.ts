import { getCurrentUser } from '@/lib/session'
import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { DateTime } from 'luxon'
import PostsWhereInput = Prisma.PostsWhereInput

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({error: 'Unauthorized.'}, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const reqStatus = searchParams.get('status')
    const reqPage = searchParams.get('page')
    const reqLimit = searchParams.get('limit')

    const pageIndex = reqPage && !isNaN(Number(reqPage)) ? Number(reqPage) - 1 : 0
    const pageSize = reqLimit && !isNaN(Number(reqLimit)) ? Number(reqLimit) : 10

    let publishedAtFilter: Prisma.DateTimeNullableFilter<"Posts"> | null = {}
    let NOT: PostsWhereInput = {}
    switch (reqStatus) {
      case 'draft':
        publishedAtFilter = null
        break
      case 'scheduled':
        publishedAtFilter = { gt: new Date() }
        NOT.publishedAt = null
        break
      case 'published':
        publishedAtFilter = { lte: new Date() }
        NOT.publishedAt = null
        break
    }

    const createdAtFilter: Prisma.DateTimeFilter<"Posts"> = {}
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    if (startDate) {
      createdAtFilter.gte = DateTime.fromFormat(startDate, 'yyyy-MM-dd').toJSDate()
    }
    if (endDate) {
      createdAtFilter.lte = DateTime.fromFormat(endDate, 'yyyy-MM-dd').toJSDate()
    }

    const posts = await prisma.posts.findMany({
      where: {
        createdAt: createdAtFilter,
        publishedAt: publishedAtFilter,
        NOT,
      },
      take: pageSize,
      skip: (pageIndex * pageSize),
      include: {author: {select: {name: true}}},
    })

    return NextResponse.json({ data: posts })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}