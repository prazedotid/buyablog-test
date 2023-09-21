import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { DateTime } from 'luxon'
import { Prisma } from '.prisma/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const reqStatus = searchParams.get('status')
    const reqAuthorID = searchParams.get('author_id')
    const reqPage = searchParams.get('page')
    const reqLimit = searchParams.get('limit')

    const pageIndex = reqPage && !isNaN(Number(reqPage)) ? Number(reqPage) - 1 : 0
    const pageSize = reqLimit && !isNaN(Number(reqLimit)) ? Number(reqLimit) : 10

    let authorIdFilter: Prisma.StringFilter<'Posts'> = {}
    if (reqAuthorID) {
      authorIdFilter.equals = reqAuthorID
    }

    let publishedAtFilter: Prisma.DateTimeNullableFilter<'Posts'> | null = {}
    let NOT: Prisma.PostsWhereInput = {}
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

    const createdAtFilter: Prisma.DateTimeFilter<'Posts'> = {}
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
        authorId: authorIdFilter,
        createdAt: createdAtFilter,
        publishedAt: publishedAtFilter,
        NOT,
      },
      take: pageSize > -1 ? pageSize : undefined,
      skip: pageSize > -1 ? (pageIndex * pageSize) : undefined,
      include: { author: { select: { name: true } } },
    })
    const total = await prisma.posts.count({
      where: {
        authorId: authorIdFilter,
        createdAt: createdAtFilter,
        publishedAt: publishedAtFilter,
        NOT,
      }
    })

    return NextResponse.json({ data: posts, meta: { total } })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}