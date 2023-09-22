'use client'

import clsx from 'clsx'
import { DateTime } from 'luxon'
import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'

import DatePicker from '@/components/DatePicker'
import DataTable, { DataTableField } from '@/components/data-table/DataTable'
import useDebounce from '@/hooks/useDebounce'
import fetcher from '@/lib/swr'
import ActionCell from './ActionCell'
import PostStatus from './PostStatus'
import { useRouter } from 'next/navigation'
import Modal from '@/components/Modal'

interface PaginatedData<T> {
  data: T[]
  meta: PaginationMeta
}

interface PaginationMeta {
  total: number
}

interface Post {
  id: string
  title: string
  author: {
    name: string
  }
  views: number
  publishedAt: string | null
  createdAt: string
}

interface User {
  id: string
  name: string
}

export default function Posts() {
  const router = useRouter()
  const [searchFilter, setSearchFilter] = useState('')
  const [authorFilter, setAuthorFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [startDateFilter, setStartDateFilter] = useState<Date | null>(null)
  const [endDateFilter, setEndDateFilter] = useState<Date | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [toBeDeletedId, setToBeDeletedId] = useState<string | null>(null)

  function handleOnDeleteClick(id: string | null, val: boolean) {
    setOpenDeleteModal(val)
    setToBeDeletedId(id)
  }

  const fields: DataTableField<Post>[] = [
    { name: 'Title', selector: p => p.title },
    { name: 'Author', selector: p => p.author.name },
    { name: 'Status', format: p => <PostStatus publishedAt={p.publishedAt}/> },
    { name: 'Views', selector: p => p.views.toLocaleString() },
    {
      name: 'Publication Date',
      selector: p => p.publishedAt ? DateTime.fromISO(p.publishedAt).toFormat('yyyy-MM-dd') : '-'
    },
    {
      name: 'Creation Date',
      selector: p => DateTime.fromISO(p.createdAt).toFormat('yyyy-MM-dd')
    },
    {
      name: 'Actions',
      cell: p => (
        <ActionCell
          id={p.id}
          onUpdateClick={id => router.push('/admin/posts/' + id)}
          onDeleteClick={id => handleOnDeleteClick(id, true)}
        />
      )
    }
  ]

  const handleSearch = (search: string) => {
    setSearchFilter(search)
  }
  const debouncedSearch = useDebounce(searchFilter)

  const postsUrl = useMemo(() => {
    const paramsObj: Record<string, any> = { page: pageNumber, limit: rowsPerPage }
    if (debouncedSearch) paramsObj.search = debouncedSearch
    if (authorFilter) paramsObj.author_id = authorFilter
    if (statusFilter) paramsObj.status = statusFilter
    if (startDateFilter) paramsObj.start_date = DateTime.fromJSDate(startDateFilter).toFormat('yyyy-MM-dd')
    if (endDateFilter) paramsObj.end_date = DateTime.fromJSDate(endDateFilter).toFormat('yyyy-MM-dd')

    return '/api/posts?' + new URLSearchParams(paramsObj).toString()
  }, [pageNumber, rowsPerPage, debouncedSearch, authorFilter, statusFilter, startDateFilter, endDateFilter])
  const { data: posts, isLoading, mutate } = useSWR<PaginatedData<Post>>(postsUrl, fetcher)
  const { data: users } = useSWR<PaginatedData<User>>('/api/users', fetcher)

  async function onConfirmDelete() {
    if (!toBeDeletedId) return

    try {
      setDeleteLoading(true)
      await fetch('/api/posts/' + toBeDeletedId, { method: 'DELETE' })
    } catch (e) {
      console.error(e)
    } finally {
      await mutate()
      setDeleteLoading(false)

      setOpenDeleteModal(false)
      setToBeDeletedId(null)
    }
  }

  return (
    <>
      <div className="w-full py-2">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold leading-none text-gray-900">Manage Posts</h3>
          <Link
            href="/admin/posts/create"
            className="flex items-center gap-4 px-4 py-2 bg-blue-500 text-sm text-white uppercase font-bold rounded"
          >
            <PlusIcon/>
            <span>Create New Post</span>
          </Link>
        </div>
        <div className="bg-white border border-gray-200">
          <div className="flex items-center justify-between py-4 px-4">
            <div className="flex-1 mr-3">
              <p className="text-xs uppercase mb-2 font-bold text-gray-500">Search</p>
              <input
                type="text"
                placeholder="Search by title..."
                value={searchFilter}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              />
            </div>
            <div className="flex items-center relative">
              <div className="mr-3 w-36">
                <p className="text-xs uppercase mb-2 font-bold text-gray-500">Author</p>
                <select
                  onChange={(e) => setAuthorFilter(e.target.value)}
                  value={authorFilter}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                >
                  <option value="">All</option>
                  {users && users.data.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div className="mr-3 w-36">
                <p className="text-xs uppercase mb-2 font-bold text-gray-500">Status</p>
                <select
                  onChange={(e) => setStatusFilter(e.target.value)}
                  value={statusFilter}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                >
                  <option value="">All</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div>
                <p className="text-xs uppercase mb-2 font-bold text-gray-500">Creation Date</p>
                <div className="flex items-center">
                  <div className="mr-3 w-48">
                    <DatePicker onChange={setStartDateFilter} placeholder="Start Date"/>
                  </div>
                  <div className="mr-3 w-48">
                    <DatePicker onChange={setEndDateFilter} placeholder="End Date"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <DataTable
              fields={fields}
              data={posts?.data ?? []}
              isLoading={isLoading}
              pagination
              paginationTotalRows={posts?.meta.total ?? 0}
              paginationPerPage={rowsPerPage}
              onPageChange={(page) => setPageNumber(page)}
              onRowsPerPageChange={(rowsPerPage) => setRowsPerPage(rowsPerPage)}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={openDeleteModal}
        header={'Are you sure you want to delete this post?'}
        body={<p className="text-sm text-gray-600 mb-6">This post will be deleted immediately.</p>}
        onIsOpenChange={(val) => handleOnDeleteClick(toBeDeletedId, val)}
      >
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            className={clsx(
              'inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
              deleteLoading ? 'opacity-50' : 'hover:bg-red-200',
            )}
            onClick={onConfirmDelete}
            disabled={deleteLoading}
          >
            Delete Post
          </button>
          <button
            type="button"
            className={clsx(
              'inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
              deleteLoading ? 'opacity-50' : 'hover:bg-gray-200',
            )}
            onClick={() => handleOnDeleteClick(toBeDeletedId, false)}
            disabled={deleteLoading}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </>
  )
}