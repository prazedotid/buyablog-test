'use client'

import clsx from 'clsx'
import { ReactNode, useEffect, useMemo, useState } from 'react'

import Pagination from '@/components/data-table/Pagination'
import { noop } from '@/lib/util'
import useDidUpdateEffect from '@/hooks/useDidUpdateEffect'

export type Primitive = string | number | boolean
export type Format<T> = (row: T, rowIndex?: number) => ReactNode
export type Selector<T> = (row: T, rowIndex?: number) => Primitive

export interface DataTableField<T> {
  name?: string
  sortable?: boolean
  format?: Format<T>
  selector?: Selector<T>
  cell?: (row: T, rowIndex: number, field: DataTableField<T>) => ReactNode
}

export type DataTableProps<T> = {
  fields: DataTableField<T>[]
  data: T[]
  isLoading?: boolean
  pagination?: boolean
  paginationDefaultPage?: number
  paginationPerPage?: number
  paginationTotalRows?: number
  onPageChange?: (page: number, totalRows: number) => void
  onRowsPerPageChange?: (perPage: number, currentPage: number) => void
}

export function getProperty<T>(
  row: T,
  format: Format<T> | undefined | null,
  selector: Selector<T> | undefined | null,
  rowIndex: number
): ReactNode {
  if (format) {
    return format(row, rowIndex)
  }

  if (selector) {
    return selector(row, rowIndex)
  }

  return null
}

export default function DataTable<T>(props: DataTableProps<T>) {
  const {
    fields,
    data: rows,
    pagination = false,
    paginationDefaultPage = 1,
    paginationPerPage = 10,
    paginationTotalRows = 0,
    isLoading = false,
    onPageChange = noop,
    onRowsPerPageChange = noop,
  } = props
  const tableClassName = clsx('min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden', pagination ? 'mb-3' : 'mb-6')
  const tableFields = fields.map(r => {
    if (r.sortable === undefined) {
      r.sortable = true
    }

    return r
  })

  const [currentPage, setCurrentPage] = useState(() => paginationDefaultPage)
  const [rowsPerPage, setRowsPerPage] = useState(() => paginationPerPage)

  const tableRows = useMemo(() => {
    return rows
  }, [currentPage, pagination, rowsPerPage, rows])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  const handleRowsPerPageChange = (perPage: number) => {
    setRowsPerPage(perPage)
  }

  useDidUpdateEffect(() => {
    onPageChange(currentPage, paginationTotalRows || rows.length)
  }, [currentPage])

  useDidUpdateEffect(() => {
    onRowsPerPageChange(rowsPerPage, currentPage)
  }, [rowsPerPage])

  return (
    <div>
      <table className={tableClassName}>
        <thead className="bg-gray-50">
        <tr>
          {tableFields.map((h, i) => (
            <th key={i}
                className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white">{h.name}</th>
          ))}
        </tr>
        </thead>
        {isLoading && (
          <tbody>
            <tr>
              <td colSpan={tableFields.length} className="text-center py-4 text-gray-800 text-sm">Loading...</td>
            </tr>
          </tbody>
        )}
        {!isLoading && (
          <tbody className="divide-y divide-gray-200">
          {tableRows && tableRows.length === 0 && (
            <tr>
              <td colSpan={tableFields.length} className="text-center py-4 text-gray-800 text-sm">No rows found.</td>
            </tr>
          )}
          {tableRows && tableRows.length > 0 && tableRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {tableFields.map((field, i) => (
                <td key={i} className="p-4 text-sm text-left text-gray-800">
                  {!field.cell && getProperty(row, field.format, field.selector, rowIndex)}
                  {field.cell && field.cell(row, rowIndex, field)}
                </td>
              ))}
            </tr>
          ))}
          </tbody>
        )}
      </table>

      {pagination && (
        <Pagination
          rowsPerPage={rowsPerPage}
          rowCount={paginationTotalRows}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      )}
    </div>
  )
}