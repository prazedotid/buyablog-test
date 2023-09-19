import { PrismaClient } from '@prisma/client'
import { default as readingTime } from "reading-time";

const prismaClientSingleton = () => {
  const prisma = new PrismaClient().$extends({
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
