import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { Search, Loader2, MapPin } from 'lucide-react'

// Leaflet's default marker icon references image URLs that don't resolve under
// bundlers like Vite. Point them at Leaflet's own CDN-hosted assets instead.
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface LocationPickerProps {
  latitude: number | null
  longitude: number | null
  onChange: (lat: number, lng: number) => void
}

// Bounding box roughly covering all of India (lon_min, lat_max, lon_max, lat_min),
// used to bias/restrict Nominatim results toward Indian addresses and places.
const INDIA_VIEWBOX = '68.1,37.1,97.4,6.5'

interface Suggestion {
  displayName: string
  lat: number
  lon: number
}

const DEFAULT_CENTER: [number, number] = [22.3072, 73.1812] // Vadodara, matches seeded stores

export const LocationPicker: React.FC<LocationPickerProps> = ({ latitude, longitude, onChange }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const searchBoxRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const initialCenter: [number, number] =
      latitude != null && longitude != null ? [latitude, longitude] : DEFAULT_CENTER

    const map = L.map(mapContainerRef.current).setView(initialCenter, latitude != null ? 14 : 12)
    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    if (latitude != null && longitude != null) {
      markerRef.current = L.marker([latitude, longitude], { icon: defaultIcon, draggable: true }).addTo(map)
      markerRef.current.on('dragend', () => {
        const pos = markerRef.current!.getLatLng()
        onChange(pos.lat, pos.lng)
      })
    }

    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng
      onChange(lat, lng)
    })

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep the marker/view in sync when coordinates change from outside (search, manual input, drag).
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (latitude == null || longitude == null) {
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }
      return
    }

    if (!markerRef.current) {
      markerRef.current = L.marker([latitude, longitude], { icon: defaultIcon, draggable: true }).addTo(map)
      markerRef.current.on('dragend', () => {
        const pos = markerRef.current!.getLatLng()
        onChange(pos.lat, pos.lng)
      })
    } else {
      markerRef.current.setLatLng([latitude, longitude])
    }

    map.setView([latitude, longitude], Math.max(map.getZoom(), 14))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude])

  // Close the suggestions dropdown on outside click.
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced live suggestions as the admin types, like Google Maps' search box.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    const query = searchQuery.trim()
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
            `&countrycodes=in&viewbox=${INDIA_VIEWBOX}&bounded=1&q=${encodeURIComponent(query)}`,
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
        setSearchError(null)
      } catch {
        setSearchError('Search failed. Please try again or click on the map directly.')
        setSuggestions([])
      } finally {
        setSearching(false)
      }
    }, 350)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchQuery])

  const selectSuggestion = (s: Suggestion) => {
    onChange(s.lat, s.lon)
    setSearchQuery(s.displayName)
    setShowSuggestions(false)
    setSuggestions([])
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
      } else {
        selectSuggestion(suggestions[0])
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div ref={searchBoxRef} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#757684] pointer-events-none" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search for a place or address…"
            className="w-full h-9 pl-8 pr-8 bg-white border border-[#c4c5d5] rounded text-sm text-[#0b1c30] placeholder:text-[#757684] focus:outline-none focus:border-[#00288e] focus:ring-2 focus:ring-[#00288e]/15"
          />
          {searching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 animate-spin text-[#757684]" />
          )}
        </div>

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
      {searchError && <p className="text-xs text-[#ba1a1a]">{searchError}</p>}
      <div ref={mapContainerRef} className="w-full h-64 rounded-lg overflow-hidden border border-[#c4c5d5]" />
      <p className="text-xs text-[#444653] flex items-center gap-1">
        <MapPin className="w-3 h-3" />
        Click on the map or drag the pin to set the exact store location.
      </p>
    </div>
  )
}
