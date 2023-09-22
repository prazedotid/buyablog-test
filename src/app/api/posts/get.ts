import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    // params
    const reqSearch = searchParams.get('search')
    const reqStatus = searchParams.get('status')
    const reqSort = searchParams.get('sort')
    const reqCategoryID = searchParams.get('category_id')
    const reqAuthorID = searchParams.get('author_id')
    const reqPage = searchParams.get('page')
    const reqLimit = searchParams.get('limit')
    const pubStartDate = searchParams.get('published_from')
    const pubEndDate = searchParams.get('published_until')

    const pageIndex = reqPage && !isNaN(Number(reqPage)) ? Number(reqPage) - 1 : 0
    const pageSize = reqLimit && !isNaN(Number(reqLimit)) ? Number(reqLimit) : 10

    // non-authenticated users can only see published posts
    let needsAuth = reqStatus !== 'published'
    if (needsAuth) {
      const session = await getCurrentUser()
      if (!session) {
        return NextResponse.json('Unauthorized.', { status: 401 })
      }
    }

    // for lookup with full text search
    const matchCriteria: Record<string, any> = { $expr: {} }
    if (pubStartDate || pubEndDate || reqStatus) {
      if (reqStatus === 'draft') {
        matchCriteria.publishedAt = { ...matchCriteria.publishedAt, $eq: null }
      } else {
        matchCriteria.publishedAt = { ...matchCriteria.publishedAt, $ne: null }
      }
      if (reqStatus === 'scheduled') matchCriteria.publishedAt.$gte = { $date: new Date() }
      if (reqStatus === 'published') matchCriteria.publishedAt.$lte = { $date: new Date() }

      if (pubStartDate) matchCriteria.publishedAt.$gte = { $date: new Date(pubStartDate) }
      if (pubEndDate) matchCriteria.publishedAt.$lte = { $date: new Date(pubEndDate) }
    }
    if (reqSearch) matchCriteria.$text = { $search: reqSearch }
    if (reqCategoryID) matchCriteria.categoryId = { $oid: reqCategoryID }
    if (reqAuthorID) matchCriteria.authorId = { $oid: reqAuthorID }

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

    const splitSort = reqSort?.split(',') ?? []
    if (splitSort.length) {
      const sortObj: Record<string, 1 | -1> = {}
      for (const sortEntry of splitSort) {
        const [col, order = 'asc'] = sortEntry.split(':')
        sortObj[col] = order === 'asc' ? 1 : -1
      }
      if (Object.keys(sortObj).length > 0) rawAggregatePipeline.push({ $sort: sortObj })
    }
    if (pageSize > -1) {
      rawAggregatePipeline.push({ $limit: pageSize }, { $skip: (pageIndex * pageSize) })
    }

    const posts = await prisma.posts.aggregateRaw({ pipeline: rawAggregatePipeline })

    let total = 0
    const getTotal = await prisma.posts.aggregateRaw({
      pipeline: [
        { $match: matchCriteria },
        { $count: 'total' },
      ],
    })
    if (getTotal && getTotal.length === 1) {
      total = (getTotal[0] as Prisma.JsonObject).total as number
    }

    return NextResponse.json({ data: posts, meta: { total } })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}