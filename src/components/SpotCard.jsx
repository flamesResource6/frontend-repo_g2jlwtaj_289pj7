import { MapPin, Navigation, Star } from 'lucide-react'

function SpotCard({ spot }) {
  const fallbackImg = (() => {
    const q = encodeURIComponent(spot?.location || spot?.name || 'travel')
    return `https://source.unsplash.com/800x600/?${q}`
  })()
  const cover = spot?.images?.[0] || fallbackImg

  return (
    <div className="group rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        {cover ? (
          <img src={cover} alt={spot.name} className="w-full h-full object-cover group-hover:scale-[1.02] transition" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white/50">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-white font-semibold text-lg">{spot.name}</h3>
            <div className="flex items-center gap-2 text-white/70 text-sm mt-1">
              <MapPin className="w-4 h-4" />
              <span>{spot.location}</span>
            </div>
          </div>
          {typeof spot.rating === 'number' && (
            <div className="flex items-center gap-1 text-amber-300">
              <Star className="w-4 h-4 fill-amber-300" />
              <span className="text-sm">{spot.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <p className="text-white/70 text-sm mt-3 line-clamp-2">{spot.description}</p>
        <div className="mt-3 flex items-center gap-2 text-cyan-300 text-sm">
          <Navigation className="w-4 h-4" />
          <span className="truncate">{spot.route}</span>
        </div>
        {spot.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {spot.tags.slice(0, 4).map((t, i) => (
              <span key={i} className="px-2 py-1 rounded-full bg-white/10 border border-white/10 text-white/70 text-xs">#{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SpotCard
