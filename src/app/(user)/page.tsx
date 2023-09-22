'use client'

import React from 'react'

import { useSearchParams } from 'next/navigation'
import useSWRInfinite from 'swr/infinite'
import { MaximizeIcon } from 'lucide-react'

import { PaginatedData } from '@/lib/types'
import { fetcherData } from '@/lib/swr'
import ArticleCard from './ArticleCard'

interface Post {
  id: string
  title: string
  slug: string
  description: string
  imageUrl: string | null
  author: {
    name: string
  }
  category: {
    name: string
  }
  views: number
  publishedAt: string | null
  createdAt: string
}

export default function Home() {
  const searchParams = useSearchParams()
  const rowsPerPage = 8

  const postsUrl = (pageIndex: number, previousPageData: Array<PaginatedData<Post>>) => {
    if (previousPageData && !previousPageData.length) return null

    const paramsObj: Record<string, any> = {
      status: 'published',
      limit: rowsPerPage,
      page: pageIndex + 1,
      sort: 'publishedAt:desc',
    }
    if (searchParams.has('search')) paramsObj.search = searchParams.get('search')

    return '/api/posts?' + new URLSearchParams(paramsObj).toString()
  }
  const { data = [], size, setSize, isLoading } = useSWRInfinite<Post[]>(postsUrl, fetcherData)

  const posts = data ? ([] as Post[]).concat(...data) : []
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined")
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < rowsPerPage)

  return (
    <>
      {posts.length === 0 && !isLoadingMore && (
        <div className="flex items-center">
          <div className="flex flex-col text-gray-500 items-center mx-auto py-24">
            <MaximizeIcon size={60} />
            <p className="mt-4 text-xl">No posts found</p>
          </div>
        </div>
      )}
      {posts.map((post) => <ArticleCard key={post.id} post={post}/>)}

      {!isReachingEnd && (
        <button
          className="block mt-8 mx-auto border border-gray-300 rounded px-12 py-4"
          disabled={isLoadingMore}
          onClick={() => setSize(size + 1)}
        >
          {isLoadingMore
            ? "Loading..."
            : "Load more"}
        </button>
      )}
    </>
  )
}
