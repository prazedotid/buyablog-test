import { ReactNode } from 'react'

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

export default function DataTable<T>({fields, data: rows }: DataTableProps<T>) {
  const tableFields = fields.map(r => {
    if (r.sortable === undefined) {
      r.sortable = true
    }

    return r
  })

  return (
    <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
      <thead className="bg-gray-50">
      <tr>
        {tableFields.map((h, i) => (
          <th key={i}
              className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white">{h.name}</th>
        ))}
      </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
      {rows.map((row, rowIndex) => (
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
    </table>
  )
}