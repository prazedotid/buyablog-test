import { hash } from 'bcrypt'
import prisma from '../src/lib/prisma'
import { faker } from '@faker-js/faker'

async function main() {
  const adminPw = await hash('admin', 10)
  const writerPw = await hash('writer', 10)

  const [admin, admin2, writer] = await Promise.all([
    prisma.users.upsert({
      where: { username: 'admin' },
      update: { password: adminPw },
      create: {
        name: 'Administrator',
        username: 'admin',
        password: adminPw,
      }
    }),
    prisma.users.upsert({
      where: { username: 'admin2' },
      update: { password: adminPw },
      create: {
        name: 'Administrator 2',
        username: 'admin2',
        password: adminPw,
      }
    }),
    prisma.users.upsert({
      where: { username: 'writer' },
      update: { password: writerPw },
      create: {
        name: 'Writer A',
        username: 'writer',
        password: writerPw,
      }
    }),
  ])

  const [seo, tech, popCulture] = await Promise.all([
    prisma.categories.upsert({
      where: { slug: 'seo' },
      update: {},
      create: {
        name: 'SEO',
        description: 'SEO tips & tricks.',
      },
    }),
    prisma.categories.upsert({
      where: { slug: 'technology' },
      update: {},
      create: {
        name: 'Technology',
        description: 'Technology tips & tricks.',
      },
    }),
    prisma.categories.upsert({
      where: { slug: 'pop-culture' },
      update: {},
      create: {
        name: 'Pop Culture',
        description: 'Everything about pop culture.',
      },
    })
  ])

  await Promise.all(
    Array.from(Array(35).keys()).map(() => {
      return prisma.posts.create({
        data: {
          title: faker.lorem.sentence(),
          description: faker.lorem.sentences({ min: 1, max: 3 }),
          content: faker.lorem.sentences({ min: 5, max: 20 }),
          views: faker.number.int({ min: 5000, max: 20000 }),
          imageUrl: faker.datatype.boolean({ probability: 0.9 })
            ? faker.image.urlLoremFlickr({ width: 512, height: 512, category: 'nature' })
            : null,
          publishedAt: faker.datatype.boolean() ? faker.date.anytime() : null,
          authorId: faker.helpers.arrayElement([admin.id, admin2.id, writer.id]),
          categoryId: faker.helpers.arrayElement([seo.id, tech.id, popCulture.id]),
        },
      })
    })
  )
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })