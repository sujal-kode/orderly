import React from 'react'
import { Search, X } from 'lucide-react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder = 'Search…', className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#757684] pointer-events-none" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-9 pl-9 pr-8 bg-white border border-[#c4c5d5] rounded text-sm text-[#0b1c30] placeholder:text-[#757684] focus:outline-none focus:border-[#00288e] focus:ring-2 focus:ring-[#00288e]/15"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#757684] hover:text-[#0b1c30] cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
