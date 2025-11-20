import { useEffect, useMemo, useState } from 'react'
import SpotCard from './SpotCard'
import { featuredSpots } from '../data/featuredSpots'

function normalize(text) {
  return (text || '').toString().toLowerCase()
}

function SpotGrid({ query }) {
  const [spots, setSpots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    let cancelled = false
    const fetchSpots = async () => {
      setLoading(true)
      setError('')
      try {
        const url = new URL(`${baseUrl}/api/spots`)
        if (query) url.searchParams.set('q', query)
        const res = await fetch(url)
        if (!res.ok) throw new Error(`API ${res.status}`)
        const data = await res.json()
        if (!cancelled) setSpots(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error('Fetch error:', e)
        if (!cancelled) {
          setError('We could not reach the server. Showing featured places instead.')
          setSpots([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchSpots()
    return () => { cancelled = true }
  }, [query])

  // Merge backend results with featured when backend is empty or errored
  const mergedSpots = useMemo(() => {
    const list = spots && spots.length > 0 ? spots : []
    // Create a map to avoid duplicates (by name+location)
    const map = new Map()
    const add = (s) => {
      const key = `${normalize(s.name)}|${normalize(s.location)}`
      if (!map.has(key)) map.set(key, s)
    }
    list.forEach(add)
    featuredSpots.forEach(add)

    const arr = Array.from(map.values())

    // Client-side search filter as a backup to ensure search "works in background"
    const q = normalize(query)
    if (q) {
      return arr.filter(s => {
        const fields = [s.name, s.location, s.description, ...(s.tags || [])].map(normalize)
        return fields.some(f => f.includes(q))
      })
    }
    return arr
  }, [spots, query])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div>
      {error && (
        <div className="mb-4 text-amber-300 text-sm bg-amber-500/10 border border-amber-400/20 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}
      <div id="explore" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mergedSpots.map(s => (
          <SpotCard key={s.id || `${s.name}-${s.location}`} spot={s} />
        ))}
        {mergedSpots.length === 0 && (
          <div className="col-span-full text-center text-white/70">No spots found. Try a different search.</div>
        )}
      </div>
    </div>
  )
}

export default SpotGrid
