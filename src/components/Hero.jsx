import Spline from '@splinetool/react-spline'
import { motion } from 'framer-motion'

function Hero({ onAddNew }) {
  return (
    <section className="relative h-[70vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/dRBdpY8aSqcdPO2y/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Gradient overlay for readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />

      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur text-white/80 text-sm mb-4 border border-white/20">
              Adventure • Technology • Exploration
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
              Pravas Pro
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-white/80 max-w-2xl">
              Discover breathtaking travel spots with routes, photos and insider details. Search, plan and add your own gems.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <button onClick={onAddNew} className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold shadow-lg shadow-white/10 hover:shadow-white/20 transition">
                <span className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-cyan-400 to-amber-300 opacity-0 group-hover:opacity-100 blur-md transition" />
                + Add New Spot
              </button>
              <a href="#explore" className="text-white/80 hover:text-white transition">
                Explore spots ↓
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
