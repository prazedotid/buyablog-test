'use client'

import { DateTime } from 'luxon'
import { useMemo, useState } from 'react'
import useSWR from 'swr'

import DatePicker from '@/components/DatePicker'
import DataTable, { DataTableField } from '@/components/DataTable'
import fetcher from '@/lib/swr'
import ActionCell from './ActionCell'
import PostStatus from './PostStatus'

interface Post {
  id: string
  title: string
  author: {
    name: string
  }
  views: number
  publishedAt: string
}

export default function Posts() {
  const [statusFilter, setStatusFilter] = useState('')
  const [startDateFilter, setStartDateFilter] = useState<Date | null>(null)
  const [endDateFilter, setEndDateFilter] = useState<Date | null>(null)
  const [pageIndex, setPageIndex] = useState(1)

  const fields: DataTableField<Post>[] = [
    { name: 'Title', selector: p => p.title },
    { name: 'Author', selector: p => p.author.name },
    { name: 'Status', format: p => <PostStatus publishedAt={p.publishedAt}/> },
    { name: 'Views', selector: p => p.views.toLocaleString() },
    {
      name: 'Publication Date',
      selector: p => p.publishedAt ? DateTime.fromISO(p.publishedAt).toFormat('yyyy-MM-dd') : '-'
    },
    { name: 'Actions', cell: p => <ActionCell id={p.id}/> }
  ]

  const postsUrl = useMemo(() => {
    const paramsObj: Record<string, any> = { page: pageIndex }
    if (statusFilter) {
      paramsObj.status = statusFilter
    }
    if (startDateFilter) {
      paramsObj.start_date = DateTime.fromJSDate(startDateFilter).toFormat('yyyy-MM-dd')
    }
    if (endDateFilter) {
      paramsObj.end_date = DateTime.fromJSDate(endDateFilter).toFormat('yyyy-MM-dd')
    }

    return '/api/posts?' + new URLSearchParams(paramsObj).toString()
  }, [pageIndex, statusFilter, startDateFilter, endDateFilter])
  const { data } = useSWR<{ data: Post[] }>(postsUrl, fetcher)

  return (
    <>
      <div className="w-full px-6 py-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold leading-none text-gray-900">Manage Posts</h3>
          <div className="flex items-center relative">
            <div className="mr-3 w-56">
              <select
                onChange={(e) => setStatusFilter(e.target.value)}
                value={statusFilter}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              >
                <option value="">Filter by status</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="mr-3">
              <DatePicker onChange={setStartDateFilter} placeholder="Start Date"/>
            </div>
            <div className="mr-3">
              <DatePicker onChange={setEndDateFilter} placeholder="End Date"/>
            </div>
          </div>
        </div>
        <div>
          {data && <DataTable fields={fields} data={data.data}></DataTable>}
        </div>
      </div>
    </>
  )
}