import React from 'react'

export const FieldError: React.FC<{ message?: string }> = ({ message }) => {
  if (!message) return null
  return <p className="text-xs text-[#ba1a1a]">{message}</p>
}

export const fieldInputClass = (hasError?: boolean) =>
  `h-9 px-3 bg-white border rounded text-sm text-[#0b1c30] focus:outline-none focus:ring-2 ${
    hasError
      ? 'border-[#ba1a1a] focus:border-[#ba1a1a] focus:ring-[#ba1a1a]/15'
      : 'border-[#c4c5d5] focus:border-[#00288e] focus:ring-[#00288e]/15'
  }`
