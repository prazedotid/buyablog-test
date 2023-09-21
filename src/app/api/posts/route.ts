import { getCurrentUser } from '@/lib/session'
import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { DateTime } from 'luxon'

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({error: 'Unauthorized.'}, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const reqPage = searchParams.get('page')
    const reqLimit = searchParams.get('limit')

    const pageIndex = reqPage && !isNaN(Number(reqPage)) ? Number(reqPage) - 1 : 0
    const pageSize = reqLimit && !isNaN(Number(reqLimit)) ? Number(reqLimit) : 10
    const publishedAtFilter: Prisma.DateTimeFilter = {}

    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    if (startDate) {
      publishedAtFilter.gte = DateTime.fromFormat(startDate, 'yyyy-MM-dd').toJSDate()
    }
    if (endDate) {
      publishedAtFilter.lte = DateTime.fromFormat(endDate, 'yyyy-MM-dd').toJSDate()
    }

    const posts = await prisma.posts.findMany({
      where: {
        publishedAt: publishedAtFilter,
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