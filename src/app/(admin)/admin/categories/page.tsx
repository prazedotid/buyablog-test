'use client'

import DataTable, { DataTableField } from '@/components/data-table/DataTable'
import useSWR from 'swr'
import fetcher from '@/lib/swr'
import { PaginatedData } from '@/lib/types'

interface Category {
  id: string
  name: string
  slug: string
  posts: number
}

export default function Categories() {
  const fields: DataTableField<Category>[] = [
    { name: 'Name', selector: c => c.name },
    { name: 'Slug', selector: c => c.slug },
  ]
  const { data: categories } = useSWR<PaginatedData<Category>>('/api/categories', fetcher)

  return (
    <div className="w-full py-2">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-3xl font-bold leading-none text-gray-900">Manage Categories</h3>
      </div>

      <div className="bg-white border border-gray-200">
        <DataTable
          fields={fields}
          data={categories?.data ?? []}
        />
      </div>
    </div>
  )
}