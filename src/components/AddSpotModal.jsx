import { useMemo, useState } from 'react'

function AddSpotModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState({ name: '', location: '', description: '', route: '', images: '', tags: '', rating: '' })
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  // Live preview image based on provided image URL(s) or inferred from location/name
  const previewImage = useMemo(() => {
    const first = form.images.split(',').map(s => s.trim()).filter(Boolean)[0]
    if (first) return first
    const q = encodeURIComponent(form.location || form.name || 'travel')
    return `https://source.unsplash.com/800x600/?${q}`
  }, [form.images, form.location, form.name])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const images = form.images
      ? form.images.split(',').map(s => s.trim()).filter(Boolean)
      : [`https://source.unsplash.com/1200x800/?${encodeURIComponent(form.location || form.name || 'travel')}`]

    const payload = {
      name: form.name,
      location: form.location,
      description: form.description,
      route: form.route,
      images,
      tags: form.tags.split(',').map(s => s.trim().toLowerCase()).filter(Boolean),
      rating: form.rating ? Number(form.rating) : undefined,
    }

    try {
      const res = await fetch(`${baseUrl}/api/spots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Failed to create spot')
      const data = await res.json()
      onCreate && onCreate({ id: data.id, ...payload })
      onClose()
      setForm({ name: '', location: '', description: '', route: '', images: '', tags: '', rating: '' })
    } catch (e) {
      alert(e.message)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-slate-900 border border-white/10 text-white overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-semibold">Add New Travel Spot</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Form fields */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-white/70">Name</label>
              <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 outline-none" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/70">Location</label>
              <input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 outline-none" required />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm text-white/70">Description</label>
              <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 outline-none" required />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm text-white/70">Route (how to reach)</label>
              <input value={form.route} onChange={e=>setForm({...form,route:e.target.value})} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 outline-none" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/70">Images (comma-separated URLs)</label>
              <input value={form.images} onChange={e=>setForm({...form,images:e.target.value})} placeholder="Leave blank to auto-pick based on location" className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 outline-none" />
              <p className="text-xs text-white/50">Tip: If you leave this blank, we’ll auto-select an image for “{form.location || form.name || 'travel'}”.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/70">Tags (comma-separated)</label>
              <input value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/70">Rating (0-5)</label>
              <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e=>setForm({...form,rating:e.target.value})} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 outline-none" />
            </div>
          </div>

          {/* Live preview */}
          <div className="md:col-span-2">
            <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
              <div className="aspect-video w-full overflow-hidden">
                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h4 className="font-semibold">{form.name || 'Spot name'}</h4>
                <p className="text-white/70 text-sm mt-1">{form.location || 'Location'}</p>
                <p className="text-white/60 text-xs mt-2 line-clamp-2">{form.description || 'A short description will appear here.'}</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-white/20 text-white/80 hover:bg-white/10">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-lg bg-white text-slate-900 font-semibold hover:opacity-90">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddSpotModal
