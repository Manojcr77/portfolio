import { useEffect, useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { fadeUp, staggerContainer } from "../animations/variants"
import API from "../utils/api"

const defaultSkills = [
  { name: "Python / AI-ML",       level: 90, category: "AI/ML"    },
  { name: "TensorFlow / PyTorch", level: 82, category: "AI/ML"    },
  { name: "React.js",             level: 88, category: "Frontend" },
  { name: "Node.js / Express",    level: 84, category: "Backend"  },
  { name: "MongoDB",              level: 80, category: "Backend"  },
  { name: "JavaScript (ES6+)",    level: 87, category: "Frontend" },
]

const colors = {
  "AI/ML":   { text: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.25)", barFrom: "#7c3aed", barTo: "#a78bfa", glow: "rgba(167,139,250,0.4)"  },
  Frontend:  { text: "#22d3ee", bg: "rgba(34,211,238,0.08)",  border: "rgba(34,211,238,0.25)",  barFrom: "#0e7490", barTo: "#22d3ee", glow: "rgba(34,211,238,0.4)"   },
  Backend:   { text: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.25)",  barFrom: "#059669", barTo: "#34d399", glow: "rgba(52,211,153,0.4)"   },
  General:   { text: "#94a3b8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.2)",  barFrom: "#475569", barTo: "#94a3b8", glow: "rgba(148,163,184,0.25)" },
}

const categoryIcons = { "AI/ML": "🤖", Frontend: "🎨", Backend: "⚙️", General: "🔧" }

function SkillBar({ name, level, category, animate }) {
  const [hovered, setHovered] = useState(false)
  const [beamed,  setBeamed]  = useState(false)
  const c = colors[category] || colors.General

  const onEnter = () => { setHovered(true); setBeamed(false); setTimeout(() => setBeamed(true), 10) }
  const onLeave = () => { setHovered(false); setBeamed(false) }

  return (
    <motion.div
      variants={fadeUp}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        position: "relative", overflow: "hidden",
        background: hovered ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.025)",
        border: `1px solid ${hovered ? c.border : "rgba(255,255,255,0.07)"}`,
        borderRadius: 18, padding: "20px 22px",
        transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
        transform: hovered ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
        boxShadow: hovered ? `0 20px 50px rgba(0,0,0,0.35), 0 0 28px ${c.glow}` : "none",
        cursor: "default",
      }}
    >
      {/* Beam sweep */}
      <div style={{
        position: "absolute", top: "-50%",
        left: beamed ? "120%" : "-60%",
        width: "40%", height: "200%",
        background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.07) 50%, transparent 60%)",
        transform: "skewX(-20deg)",
        transition: beamed ? "left 0.65s ease" : "none",
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", marginBottom: 7, letterSpacing: "0.01em" }}>{name}</p>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, padding: "3px 10px", borderRadius: 999, background: c.bg, border: `1px solid ${c.border}`, color: c.text, fontFamily: "JetBrains Mono, monospace", fontWeight: 500 }}>
            <span>{categoryIcons[category] || "🔧"}</span>{category}
          </span>
        </div>
        <motion.span
          animate={{ color: hovered ? c.text : "#475569" }}
          transition={{ duration: 0.3 }}
          style={{ fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 800 }}
        >
          {level}%
        </motion.span>
      </div>

      {/* Bar */}
      <div style={{ width: "100%", height: 5, borderRadius: 999, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: animate ? `${level}%` : 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          style={{
            height: "100%", borderRadius: 999,
            background: `linear-gradient(90deg, ${c.barFrom}, ${c.barTo})`,
            boxShadow: hovered ? `0 0 14px ${c.glow}` : "none",
            transition: "box-shadow 0.3s",
            position: "relative",
          }}
        >
          {/* Shine dot at bar tip */}
          {animate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: hovered ? 1 : 0 }}
              style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: 8, height: 8, borderRadius: "50%", background: c.text, boxShadow: `0 0 8px ${c.glow}`, transition: "opacity 0.3s" }}
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function Skills() {
  const [skills, setSkills]             = useState([])
  const [activeCategory, setActiveCategory] = useState("All")
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  useEffect(() => {
    API.get("/skills")
      .then((r) => setSkills(Array.isArray(r.data) && r.data.length ? r.data : defaultSkills))
      .catch(() => setSkills(defaultSkills))
  }, [])

  const categories = ["All", ...new Set(skills.map((s) => s.category || "General"))]
  const filtered   = activeCategory === "All" ? skills : skills.filter((s) => (s.category || "General") === activeCategory)

  return (
    <section id="skills" className="relative px-6 md:px-16 py-20" ref={ref}>
      <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} className="text-center mb-14">
        <p className="section-tag mb-3">02 / skills</p>
        <div style={{ overflow: "hidden" }}>
          <motion.h2
            initial={{ y: "100%", opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold gradient-text"
          >
            Technical Arsenal
          </motion.h2>
        </div>
        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          style={{ color: "#475569", fontSize: 13, marginTop: 12, fontFamily: "JetBrains Mono, monospace" }}
        >
          hover over any card to see it shine
        </motion.p>
      </motion.div>

      {/* Filter pills */}
      <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
        style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 44 }}
      >
        {categories.map((cat) => {
          const c = colors[cat]
          const active = activeCategory === cat
          return (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}
              style={{
                padding: "8px 20px", borderRadius: 999, fontSize: 12, cursor: "none",
                fontFamily: "JetBrains Mono, monospace", fontWeight: 500, transition: "all 0.25s",
                background: active ? (c?.bg || "rgba(34,211,238,0.1)") : "rgba(255,255,255,0.03)",
                border: `1px solid ${active ? (c?.border || "rgba(34,211,238,0.4)") : "rgba(255,255,255,0.1)"}`,
                color: active ? (c?.text || "#22d3ee") : "#475569",
                boxShadow: active ? `0 0 20px ${c?.glow || "rgba(34,211,238,0.2)"}` : "none",
              }}
            >
              {cat === "All" ? "⚡ All" : `${categoryIcons[cat] || ""} ${cat}`}
            </motion.button>
          )
        })}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          variants={staggerContainer} initial="hidden" animate="visible"
          exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto"
        >
          {filtered.map((skill) => (
            <SkillBar key={skill._id || skill.name} name={skill.name} level={skill.level ?? 80} category={skill.category || "General"} animate={inView} />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
