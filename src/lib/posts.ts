import {PrismaClient} from '@prisma/client'
import {default as readingTime} from 'reading-time'

export function Posts(prismaPost: PrismaClient['posts']) {
  return Object.assign(prismaPost, {
    get readingTime() {
      return Math.ceil(readingTime(prismaPost.content).minutes) + ' min read'
    }
  })
}