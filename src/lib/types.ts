export interface PaginatedData<T> {
  data: T[]
  meta: PaginationMeta
}

export interface PaginationMeta {
  total: number
}