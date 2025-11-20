import { useState } from 'react'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import SpotGrid from './components/SpotGrid'
import AddSpotModal from './components/AddSpotModal'

function App() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar query={query} setQuery={setQuery} />
      <Hero onAddNew={() => setOpen(true)} />

      <main className="relative z-10 -mt-8">
        <div className="mx-auto max-w-6xl px-6 pb-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-white text-2xl font-bold">Trending Spots</h2>
            <button onClick={() => setOpen(true)} className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold">+ New</button>
          </div>
          <SpotGrid query={query} />
        </div>
      </main>

      <AddSpotModal open={open} onClose={() => setOpen(false)} onCreate={() => setQuery(q => q)} />
    </div>
  )
}

export default App
