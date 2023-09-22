import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { DateTime } from 'luxon'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const reqSearch = searchParams.get('search')
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

    // for search query
    const rawAggregatePipeline: Prisma.InputJsonValue[] = [
      { $match: { $text: { $search: reqSearch } } },
      { $lookup: { from: 'Users', localField: 'authorId', foreignField: '_id', as: 'author' } },
      { $unwind: '$author' },
      {
        $project: {
          _id: 0,
          id: { $toString: '$_id' },
          slug: 1,
          title: 1,
          description: 1,
          content: 1,
          imageUrl: 1,
          authorId: { $toString: '$authorId' },
          categoryId: { $toString: '$categoryId' },
          views: 1,
          publishedAt: { $dateToString: { date: '$publishedAt' } },
          createdAt: { $dateToString: { date: '$createdAt' } },
          updatedAt: { $dateToString: { date: '$updatedAt' } },
          deletedAt: { $dateToString: { date: '$deletedAt' } },
          author: { name: 1 },
        },
      },
    ]
    if (pageSize > -1) {
      rawAggregatePipeline.push({ $limit: pageSize }, { $skip: (pageIndex * pageSize) })
    }

    // for no search query
    const findOptions = {
      where: {
        authorId: authorIdFilter,
        createdAt: createdAtFilter,
        publishedAt: publishedAtFilter,
        NOT,
      },
      take: pageSize > -1 ? pageSize : undefined,
      skip: pageSize > -1 ? (pageIndex * pageSize) : undefined,
      include: { author: { select: { name: true } } },
    }

    const posts = reqSearch
      ? await prisma.posts.aggregateRaw({ pipeline: rawAggregatePipeline })
      : await prisma.posts.findMany(findOptions)
    const total = reqSearch
      ? (
        (
          await prisma.posts.aggregateRaw({
            pipeline: [
              { $match: { $text: { $search: reqSearch } } },
              { $count: 'total' },
            ],
          })
        )[0] as Prisma.JsonObject
      ).total
      : await prisma.posts.count({
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