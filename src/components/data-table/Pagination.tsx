import { clsx } from 'clsx'
import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

interface PaginationProps {
  rowsPerPage: number
  rowCount: number
  currentPage: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (perPage: number) => void
}

export default function Pagination(props: PaginationProps) {
  const {
    rowsPerPage,
    rowCount,
    currentPage,
    onPageChange,
    onRowsPerPageChange,
  } = props

  const numPages = rowsPerPage === -1 ? 1 : Math.ceil( rowCount / rowsPerPage)
  const isLessDisabled = currentPage === 1
  const isGreaterDisabled = currentPage === numPages
  const lastIndex = rowsPerPage === -1 ? rowCount : currentPage * rowsPerPage
  const firstIndex = rowsPerPage === -1 ? 1 : lastIndex - rowsPerPage + 1
  const range =
    currentPage === numPages
      ? `${firstIndex}-${rowCount} of ${rowCount}`
      : `${firstIndex}-${lastIndex} of ${rowCount}`

  const lessButtonCls = clsx('rounded-full p-3', isLessDisabled ? 'text-gray-300' : 'text-gray-800 hover:bg-gray-100')
  const greaterButtonCls = clsx('rounded-full p-3', isGreaterDisabled ? 'text-gray-300' : 'text-gray-800 hover:bg-gray-100')

  return (
    <div className="flex items-center justify-end mb-3 mr-3">
      <div className="text-sm mr-2 text-gray-800">
        Rows per page:
      </div>

      <select
        value={rowsPerPage}
        onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
        className="bg-white text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="-1">All</option>
      </select>
      <div className="text-sm text-gray-800 mx-6">
        {range}
      </div>
      <div className="flex items-center">
        <button onClick={() => onPageChange(1)} className={lessButtonCls} disabled={isLessDisabled}>
          <ChevronFirstIcon size={20} />
        </button>
        <button onClick={() => onPageChange(currentPage - 1)} className={lessButtonCls} disabled={isLessDisabled}>
          <ChevronLeftIcon size={20} />
        </button>
        <button onClick={() => onPageChange(currentPage + 1)} className={greaterButtonCls} disabled={isGreaterDisabled}>
          <ChevronRightIcon size={20} />
        </button>
        <button onClick={() => onPageChange(numPages)} className={greaterButtonCls} disabled={isGreaterDisabled}>
          <ChevronLastIcon size={20} />
        </button>
      </div>
    </div>
  )
}