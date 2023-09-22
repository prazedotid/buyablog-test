import { PrismaClient } from '@prisma/client'
import { default as readingTime } from 'reading-time'
import slugify from 'slugify'

const prismaClientSingleton = () => {
  const prisma = new PrismaClient()

  prisma.$extends({
    result: {
      posts: {
        readingTime: {
          needs: { content: true },
          compute(post) {
            return Math.ceil(readingTime(post.content).minutes) + ' min read'
          },
        },
      },
    },
    query: {
      posts: {
        create({ args, query }) {
          if (!args.data.slug) {
            const slugTitle = slugify(args.data.title, { lower: true })
            const randomSuffix = (Math.random() + 1).toString(36).substring(7)
            args.data.slug = `${slugTitle}-${randomSuffix}`
          }

          return query(args)
        },
        upsert({ args, query }) {
          if (!args.create.slug) {
            const slugTitle = slugify(args.create.title, { lower: true })
            const randomSuffix = (Math.random() + 1).toString(36).substring(7)
            args.create.slug = `${slugTitle}-${randomSuffix}`
          }

          return query(args)
        },
      },
      categories: {
        create({ args, query }) {
          if (!args.data.slug) {
            args.data.slug = slugify(args.data.name, { lower: true })
          }

          return query(args)
        },
        upsert({ args, query }) {
          if (!args.create.slug) {
            args.create.slug = slugify(args.create.name, { lower: true })
          }

          return query(args)
        },
      },
    },
  })

  return prisma
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
