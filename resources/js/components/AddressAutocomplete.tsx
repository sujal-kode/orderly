import React, { useEffect, useRef, useState } from 'react'
import { MapPin, Loader2 } from 'lucide-react'

interface Suggestion {
  displayName: string
  lat: number
  lon: number
}

interface AddressAutocompleteProps {
  value: string
  onChange: (address: string) => void
  onSelect: (address: string, lat: number, lon: number) => void
  placeholder?: string
  hasError?: boolean
  countryCodes?: string
}

// Bounding box roughly covering all of India (lon_min, lat_max, lon_max, lat_min),
// used to bias/restrict Nominatim results toward Indian addresses and places.
const INDIA_VIEWBOX = '68.1,37.1,97.4,6.5'

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  placeholder,
  hasError,
  countryCodes = 'in',
}) => {
  const boxRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [searching, setSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    const query = value.trim()
    if (query.length < 3) {
      setSuggestions([])
      setSearching(false)
      return
    }

    setSearching(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&dedupe=1&limit=8` +
            `&countrycodes=${countryCodes}&viewbox=${INDIA_VIEWBOX}&bounded=1&q=${encodeURIComponent(query)}`,
          { headers: { Accept: 'application/json' } }
        )
        if (!res.ok) throw new Error('Search failed')
        const results = await res.json()
        setSuggestions(
          Array.isArray(results)
            ? results.map((r: { display_name: string; lat: string; lon: string }) => ({
                displayName: r.display_name,
                lat: Number(r.lat),
                lon: Number(r.lon),
              }))
            : []
        )
        setShowSuggestions(true)
        setHighlightedIndex(-1)
      } catch {
        setSuggestions([])
      } finally {
        setSearching(false)
      }
    }, 350)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, countryCodes])

  const selectSuggestion = (s: Suggestion) => {
    onSelect(s.displayName, s.lat, s.lon)
    setShowSuggestions(false)
    setSuggestions([])
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      if (highlightedIndex >= 0) {
        selectSuggestion(suggestions[highlightedIndex])
      } else if (suggestions.length > 0) {
        selectSuggestion(suggestions[0])
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div ref={boxRef} className="relative">
      <textarea
        required
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full px-3 py-2 bg-white border rounded text-sm text-[#0b1c30] placeholder:text-[#757684] focus:outline-none focus:ring-2 resize-none ${
          hasError
            ? 'border-[#ba1a1a] focus:border-[#ba1a1a] focus:ring-[#ba1a1a]/15'
            : 'border-[#c4c5d5] focus:border-[#00288e] focus:ring-[#00288e]/15'
        }`}
      />
      {searching && (
        <Loader2 className="absolute right-3 top-3 w-3.5 h-3.5 animate-spin text-[#757684]" />
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-[1000] top-full left-0 right-0 mt-1 bg-white border border-[#c4c5d5] rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {suggestions.map((s, i) => (
            <button
              key={`${s.lat}-${s.lon}-${i}`}
              type="button"
              onClick={() => selectSuggestion(s)}
              onMouseEnter={() => setHighlightedIndex(i)}
              className={`w-full text-left px-3 py-2 text-sm flex items-start gap-2 cursor-pointer transition-colors ${
                i === highlightedIndex ? 'bg-[#eff4ff] text-[#0b1c30]' : 'text-[#0b1c30] hover:bg-[#eff4ff]'
              } ${i !== suggestions.length - 1 ? 'border-b border-[#c4c5d5]/30' : ''}`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#00288e] shrink-0 mt-0.5" />
              <span className="line-clamp-2">{s.displayName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
