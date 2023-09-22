import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { DateTime } from 'luxon'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const reqSearch = searchParams.get('search')
    const reqStatus = searchParams.get('status')
    const reqCategoryID = searchParams.get('category_id')
    const reqAuthorID = searchParams.get('author_id')
    const reqPage = searchParams.get('page')
    const reqLimit = searchParams.get('limit')

    const pageIndex = reqPage && !isNaN(Number(reqPage)) ? Number(reqPage) - 1 : 0
    const pageSize = reqLimit && !isNaN(Number(reqLimit)) ? Number(reqLimit) : 10

    let needsAuth = false

    // for lookup without full text search
    let categoryIdFilter: Prisma.StringFilter<'Posts'> = {}
    if (reqCategoryID) categoryIdFilter.equals = reqCategoryID

    let authorIdFilter: Prisma.StringFilter<'Posts'> = {}
    if (reqAuthorID) authorIdFilter.equals = reqAuthorID

    let publishedAtFilter: Prisma.DateTimeNullableFilter<'Posts'> | null = {}
    let NOT: Prisma.PostsWhereInput = {}
    switch (reqStatus) {
      case 'draft':
        publishedAtFilter = null
        needsAuth = true
        break
      case 'scheduled':
        publishedAtFilter = { gt: new Date() }
        NOT.publishedAt = null
        needsAuth = true
        break
      case 'published':
        publishedAtFilter = { lte: new Date() }
        NOT.publishedAt = null
        break
      default:
        needsAuth = true
        break
    }

    if (needsAuth) {
      const session = await getCurrentUser()
      if (!session) {
        return NextResponse.json('Unauthorized.', { status: 401 })
      }
    }

    const createdAtFilter: Prisma.DateTimeFilter<'Posts'> = {}
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    if (startDate) createdAtFilter.gte = DateTime.fromFormat(startDate, 'yyyy-MM-dd').toJSDate()
    if (endDate) createdAtFilter.lte = DateTime.fromFormat(endDate, 'yyyy-MM-dd').toJSDate()

    // for lookup with full text search
    const matchCriteria: Record<string, any> = { $text: { $search: reqSearch } }
    if (reqCategoryID) matchCriteria.categoryId = reqCategoryID
    if (reqAuthorID) matchCriteria.authorId = reqAuthorID

    const postsWhereInput: Prisma.PostsWhereInput = {
      authorId: authorIdFilter,
      categoryId: categoryIdFilter,
      createdAt: createdAtFilter,
      publishedAt: publishedAtFilter,
      NOT,
    }

    const rawAggregatePipeline: Prisma.InputJsonValue[] = [
      { $match: matchCriteria },
      { $lookup: { from: 'Users', localField: 'authorId', foreignField: '_id', as: 'author' } },
      { $lookup: { from: 'Categories', localField: 'categoryId', foreignField: '_id', as: 'category' } },
      { $unwind: '$author' },
      { $unwind: '$category' },
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
          category: { name: 1 },
        },
      },
    ]
    if (pageSize > -1) {
      rawAggregatePipeline.push({ $limit: pageSize }, { $skip: (pageIndex * pageSize) })
    }

    // for no search query
    const findOptions: Prisma.PostsFindManyArgs = {
      where: postsWhereInput,
      take: pageSize > -1 ? pageSize : undefined,
      skip: pageSize > -1 ? (pageIndex * pageSize) : undefined,
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
      },
      orderBy: [{ createdAt: 'desc' }],
    }

    const posts = reqSearch
      ? await prisma.posts.aggregateRaw({ pipeline: rawAggregatePipeline })
      : await prisma.posts.findMany(findOptions)
    let total: Prisma.JsonValue = 0

    if (reqSearch) {
      const getTotal = await prisma.posts.aggregateRaw({
        pipeline: [
          { $match: matchCriteria },
          { $count: 'total' },
        ],
      })
      if (getTotal && getTotal.length === 1) {
        total = (getTotal[0] as Prisma.JsonObject).total as number
      }
    } else {
      total = await prisma.posts.count({ where: postsWhereInput })
    }

    return NextResponse.json({ data: posts, meta: { total } })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}