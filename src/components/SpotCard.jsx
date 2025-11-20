import { MapPin, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function slugify(name = '', location = '') {
  const slugPart = (s) => s?.toString().toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
  const a = slugPart(name)
  const b = slugPart(location)
  return b ? `${a}-${b}` : a
}

function SpotCard({ spot }) {
  const navigate = useNavigate()

  const fallbackImg = (() => {
    const q = encodeURIComponent(spot?.location || spot?.name || 'travel')
    return `https://source.unsplash.com/800x600/?${q}`
  })()
  const cover = spot?.images?.[0] || fallbackImg

  const goToDetails = () => {
    const slug = slugify(spot?.name, spot?.location)
    navigate(`/spot/${slug}`)
  }

  return (
    <div onClick={goToDetails} className="relative group rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition cursor-pointer">
      <div className="aspect-video w-full overflow-hidden">
        {cover ? (
          <img src={cover} alt={spot.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white/50">
            No image
          </div>
        )}
      </div>
      {/* Overlay gradient and quick meta to avoid delays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90" />
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-white font-semibold text-lg leading-tight drop-shadow">{spot.name}</h3>
          <div className="mt-1 inline-flex items-center gap-2 text-white/80 text-sm drop-shadow">
            <MapPin className="w-4 h-4" />
            <span className="truncate max-w-[14rem] sm:max-w-[16rem]">{spot.location}</span>
          </div>
        </div>
        {typeof spot.rating === 'number' && (
          <div className="inline-flex items-center gap-1 text-amber-300 bg-black/40 rounded-full px-2 py-1 backdrop-blur border border-white/10">
            <Star className="w-4 h-4 fill-amber-300" />
            <span className="text-xs font-medium">{spot.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default SpotCard
