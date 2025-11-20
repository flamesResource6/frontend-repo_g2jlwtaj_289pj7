import { Menu, Search } from 'lucide-react'

function Navbar({ query, setQuery }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-30">
      <div className="mx-4 mt-4 rounded-2xl border border-white/15 bg-slate-900/60 backdrop-blur shadow-lg">
        <div className="flex items-center gap-4 px-4 py-3">
          <button className="p-2 rounded-lg hover:bg-white/10 transition" aria-label="menu">
            <Menu className="w-5 h-5 text-white/80" />
          </button>
          <div className="text-white font-bold tracking-tight text-lg">Pravas Pro</div>
          <div className="ml-auto w-full max-w-xl relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-white/60" />
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search spots, places, tags..."
              className="w-full rounded-lg bg-white/10 text-white placeholder:text-white/60 border border-white/20 pl-10 pr-3 py-2 focus:outline-none focus:border-white/40"
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
