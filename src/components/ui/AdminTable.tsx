import { useMemo, useState } from 'react'

export interface AdminTableColumn<T> {
  key: string
  label: string
  className?: string
  render: (row: T) => React.ReactNode
  sortValue?: (row: T) => string | number
}

interface AdminTableProps<T> {
  title: string
  rows: T[]
  columns: AdminTableColumn<T>[]
  searchKeys?: Array<keyof T>
  searchPlaceholder?: string
  pageSize?: number
}

const AdminTable = <T,>({
  title,
  rows,
  columns,
  searchKeys = [],
  searchPlaceholder = 'Search...',
  pageSize = 6,
}: AdminTableProps<T>) => {
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState(columns.find((c) => c.sortValue)?.key ?? '')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (!query) return rows
    const q = query.toLowerCase()
    return rows.filter((row) =>
      searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(q)),
    )
  }, [rows, query, searchKeys])

  const sorted = useMemo(() => {
    const column = columns.find((c) => c.key === sortKey)
    if (!column?.sortValue) return filtered
    return [...filtered].sort((a, b) => {
      const av = column.sortValue!(a)
      const bv = column.sortValue!(b)
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [filtered, sortKey, sortDir, columns])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">{title}</p>
          <p className="text-xs text-slate-500">{rows.length} records</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            className="rounded-xl bg-field px-3 py-2 text-xs text-slate-200"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
          />
          <select
            className="rounded-xl bg-field px-3 py-2 text-xs text-slate-200"
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value)}
          >
            {columns
              .filter((c) => c.sortValue)
              .map((column) => (
                <option key={column.key} value={column.key}>
                  Sort: {column.label}
                </option>
              ))}
          </select>
          <button
            type="button"
            className="rounded-xl bg-white/10 px-3 py-2 text-xs uppercase tracking-widest text-slate-300"
            onClick={() => setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
          >
            {sortDir === 'asc' ? 'Asc' : 'Desc'}
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-widest text-slate-400">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={`py-2 ${column.className ?? ''}`}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, idx) => (
              <tr key={idx} className="border-t border-white/10 hover:bg-white/5">
                {columns.map((column) => (
                  <td key={column.key} className="py-2">
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg bg-white/10 px-3 py-1"
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Prev
          </button>
          <button
            type="button"
            className="rounded-lg bg-white/10 px-3 py-1"
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminTable
