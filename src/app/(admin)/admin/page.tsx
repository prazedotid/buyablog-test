import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import prisma from '@/lib/prisma'
import VisitorChart from './VisitorChart'

async function getAllPosts() {
  return prisma.posts.findMany({
    include: {author: {select: {name: true}}},
    take: 5,
  })
}

export default async function AdminDashboard() {
  const posts = await getAllPosts()

  return (
    <>
      <div className="flex gap-4 mb-4">
        <div className="w-2/3 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <VisitorChart></VisitorChart>
        </div>
        <div className="w-1/3 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold leading-none text-gray-900 mb-3">Top viewed posts this month</h3>
          <ul className="divide-y divide-gray-200 mb-3">
            {posts.map((p, i) => (
              <li key={i} className="py-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center min-w-0">
                    <img src={p.imageUrl} alt="Post image" className="w-10 h-10"/>
                    <div className="ml-3 overflow-hidden">
                      <p className="font-medium text-sm mb-1 text-gray-900 truncate">
                        {p.title}
                      </p>
                      <div className="flex items-center justify-start flex-1 text-xs text-gray-500">
                        <span className="text-gray-500">{p.author.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900">
                    1,000
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex items-center">
            <Link href="/admin/posts"
                  className="ml-auto inline-flex items-center px-4 py-2 font-medium uppercase rounded-lg text-primary-700 text-sm hover:bg-gray-100">
              All Posts
              <ArrowRight className="ml-3"/>
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h3 className="text-xl font-bold leading-none text-gray-900 mb-6">Placeholder Card</h3>
        <div className="flex items-center gap-4">
          <div className="w-2/3 h-60 border border-gray-200"></div>
          <div className="w-1/3 h-60 border border-gray-200"></div>
        </div>
      </div>
    </>
  )
}