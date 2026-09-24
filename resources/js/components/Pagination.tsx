import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { PaginationMeta } from '../services/api.js'

interface PaginationProps {
  meta: PaginationMeta
  onPageChange: (page: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange }) => {
  if (meta.lastPage <= 1) return null

  const pages: number[] = []
  const start = Math.max(1, meta.currentPage - 2)
  const end = Math.min(meta.lastPage, start + 4)
  for (let p = start; p <= end; p++) pages.push(p)

  const firstItem = (meta.currentPage - 1) * meta.perPage + 1
  const lastItem = Math.min(meta.currentPage * meta.perPage, meta.total)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 border-t border-[#c4c5d5]/30 bg-white">
      <div className="text-sm text-[#444653]">
        Showing <span className="font-medium text-[#0b1c30]">{firstItem}</span> to{' '}
        <span className="font-medium text-[#0b1c30]">{lastItem}</span> of{' '}
        <span className="font-medium text-[#0b1c30]">{meta.total}</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          disabled={meta.currentPage <= 1}
          onClick={() => onPageChange(meta.currentPage - 1)}
          className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded border border-[#c4c5d5] text-sm text-[#0b1c30] hover:bg-[#eff4ff] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded text-sm font-medium flex items-center justify-center transition-colors cursor-pointer ${
              p === meta.currentPage
                ? 'bg-[#1e40af] text-white'
                : 'border border-[#c4c5d5] text-[#0b1c30] hover:bg-[#eff4ff]'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          disabled={meta.currentPage >= meta.lastPage}
          onClick={() => onPageChange(meta.currentPage + 1)}
          className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded border border-[#c4c5d5] text-sm text-[#0b1c30] hover:bg-[#eff4ff] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
