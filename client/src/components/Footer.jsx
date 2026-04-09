import { FiHeart } from "react-icons/fi"

export default function Footer() {
  return (
    <footer className="relative border-t border-white/6 py-10 px-6 md:px-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <div className="font-display text-lg font-bold gradient-text mb-1">Manoj C R</div>
          <div className="mono text-xs text-slate-600 tracking-wider">AI/ML Engineer · MERN Stack Developer</div>
        </div>
        <div className="flex items-center gap-2 text-slate-600 text-xs">
          <span>Built with</span>
          <FiHeart className="text-red-400" size={12} />
          <span>React · Three.js · Framer Motion</span>
        </div>
      </div>
      <div className="text-center mt-6 mono text-[10px] text-slate-700 tracking-widest">
        © 2026 MANOJ C R — ALL RIGHTS RESERVED
      </div>
    </footer>
  )
}