import { useEffect, useState } from 'react'
import SpotCard from './SpotCard'

function SpotGrid({ query }) {
  const [spots, setSpots] = useState([])
  const [loading, setLoading] = useState(true)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const url = new URL(`${baseUrl}/api/spots`)
        if (query) url.searchParams.set('q', query)
        const res = await fetch(url)
        const data = await res.json()
        setSpots(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchSpots()
  }, [query])

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
    <div id="explore" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {spots.map(s => (
        <SpotCard key={s.id} spot={s} />
      ))}
      {spots.length === 0 && (
        <div className="col-span-full text-center text-white/70">No spots found. Try a different search.</div>
      )}
    </div>
  )
}

export default SpotGrid
