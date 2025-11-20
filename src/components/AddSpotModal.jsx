import { useState } from 'react'

function AddSpotModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState({ name: '', location: '', description: '', route: '', images: '', tags: '' })
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      name: form.name,
      location: form.location,
      description: form.description,
      route: form.route,
      images: form.images.split(',').map(s => s.trim()).filter(Boolean),
      tags: form.tags.split(',').map(s => s.trim().toLowerCase()).filter(Boolean),
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
      setForm({ name: '', location: '', description: '', route: '', images: '', tags: '' })
    } catch (e) {
      alert(e.message)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-white/10 text-white overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-semibold">Add New Travel Spot</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <input value={form.images} onChange={e=>setForm({...form,images:e.target.value})} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70">Tags (comma-separated)</label>
            <input value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 outline-none" />
          </div>
          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-white/20 text-white/80 hover:bg-white/10">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-lg bg-white text-slate-900 font-semibold hover:opacity-90">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddSpotModal
