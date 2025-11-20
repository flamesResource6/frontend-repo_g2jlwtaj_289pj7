import { MapPin, Navigation, Star, ArrowLeft } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { featuredSpots } from '../data/featuredSpots'

function normalize(text) {
  return (text || '').toString().toLowerCase()
}

const fallbackByQuery = (q) => `https://source.unsplash.com/1200x800/?${encodeURIComponent(q || 'travel')}`

export default function SpotDetails() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [spot, setSpot] = useState(null)
  const [loading, setLoading] = useState(true)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        // Try fetch all spots and pick the one matching slug by name+location
        const res = await fetch(`${baseUrl}/api/spots`)
        let data = []
        if (res.ok) {
          data = await res.json()
        }
        const found = (data || []).find(s => {
          const key = `${normalize(s.name)}-${normalize(s.location)}`.replace(/[^a-z0-9-]/g, '')
          return key === slug
        })
        if (!cancelled) setSpot(found || null)
      } catch (e) {
        // ignore, will fallback below
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [slug])

  // Fallback to featuredSpots when backend didn't return anything
  const spotOrFallback = useMemo(() => {
    if (spot) return spot
    const fromFeatured = featuredSpots.find(s => {
      const key = `${normalize(s.name)}-${normalize(s.location)}`.replace(/[^a-z0-9-]/g, '')
      return key === slug
    })
    return fromFeatured || null
  }, [spot, slug])

  const cover = useMemo(() => {
    if (!spotOrFallback) return fallbackByQuery(slug)
    const primary = spotOrFallback?.images?.[0]
    if (primary) return primary
    const q = spotOrFallback?.location || spotOrFallback?.name
    return fallbackByQuery(q)
  }, [spotOrFallback, slug])

  if (loading && !spotOrFallback) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="h-64 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
      </div>
    )
  }

  if (!spotOrFallback) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10 text-white/80">
        <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-white/80 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h2 className="text-2xl font-bold">Spot not found</h2>
        <p className="mt-2 text-white/60">Try exploring from the home page.</p>
      </div>
    )
  }

  const s = spotOrFallback

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="relative">
        <img src={cover} alt={s.name} className="w-full h-[40vh] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-24 relative z-10">
        <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-6">
          <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-2 text-white/80 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{s.name}</h1>
              <div className="flex items-center gap-2 text-white/70 mt-2">
                <MapPin className="w-4 h-4" />
                <span>{s.location}</span>
              </div>
            </div>
            {typeof s.rating === 'number' && (
              <div className="flex items-center gap-1 text-amber-300">
                <Star className="w-5 h-5 fill-amber-300" />
                <span className="text-sm">{s.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {s.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {s.tags.map((t, i) => (
                <span key={i} className="px-2 py-1 rounded-full bg-white/10 border border-white/10 text-white/70 text-xs">#{t}</span>
              ))}
            </div>
          )}

          <p className="mt-4 text-white/80 leading-relaxed">{s.description}</p>

          {s.route && (
            <div className="mt-4 text-cyan-300 flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              <span className="truncate">{s.route}</span>
            </div>
          )}

          {Array.isArray(s.images) && s.images.length > 0 && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
              {s.images.map((img, idx) => (
                <img key={idx} src={img} alt={`${s.name} ${idx+1}`} className="w-full aspect-video object-cover rounded-lg border border-white/10" />)
              )}
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-white font-semibold mb-2">Best things to see nearby</h3>
            <ul className="list-disc list-inside text-white/70 space-y-1">
              <li>Top viewpoints and photo spots</li>
              <li>Local markets and food streets</li>
              <li>Heritage sites and museums</li>
              <li>Nature trails and short hikes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
