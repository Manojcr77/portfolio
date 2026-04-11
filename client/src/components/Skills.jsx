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
  "AI/ML":    { text: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.2)", barFrom: "#7c3aed", barTo: "#a78bfa", glow: "rgba(167,139,250,0.35)" },
  Frontend:   { text: "#22d3ee", bg: "rgba(34,211,238,0.08)",  border: "rgba(34,211,238,0.2)",  barFrom: "#0e7490", barTo: "#22d3ee", glow: "rgba(34,211,238,0.35)"   },
  Backend:    { text: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.2)",  barFrom: "#059669", barTo: "#34d399", glow: "rgba(52,211,153,0.35)"   },
  General:    { text: "#94a3b8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.2)", barFrom: "#475569", barTo: "#94a3b8", glow: "rgba(148,163,184,0.25)"  },
}

const categoryIcons = { "AI/ML": "🤖", Frontend: "🎨", Backend: "⚙️", General: "🔧" }

function SkillBar({ name, level, category, animate }) {
  const [hovered, setHovered] = useState(false)
  const c = colors[category] || colors.General

  return (
    <motion.div
      variants={fadeUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? c.border : "rgba(255,255,255,0.08)"}`,
        borderRadius: 16, padding: "18px 20px",
        transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hovered ? `0 16px 40px rgba(0,0,0,0.3), 0 0 20px ${c.glow}` : "none",
        cursor: "default",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", marginBottom: 6, letterSpacing: "0.01em" }}>{name}</p>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: 10, padding: "3px 10px", borderRadius: 999,
            background: c.bg, border: `1px solid ${c.border}`, color: c.text,
            fontFamily: "JetBrains Mono, monospace", fontWeight: 500,
          }}>
            <span style={{ fontSize: 11 }}>{categoryIcons[category] || "🔧"}</span>
            {category}
          </span>
        </div>
        <motion.span
          animate={{ color: hovered ? c.text : "#64748b" }}
          style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800 }}
        >
          {level}%
        </motion.span>
      </div>

      {/* Bar track */}
      <div style={{ width: "100%", height: 6, borderRadius: 999, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: animate ? `${level}%` : 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          style={{
            height: "100%", borderRadius: 999,
            background: `linear-gradient(90deg, ${c.barFrom}, ${c.barTo})`,
            boxShadow: hovered ? `0 0 12px ${c.glow}` : "none",
            transition: "box-shadow 0.3s",
          }}
        />
      </div>
    </motion.div>
  )
}

export default function Skills() {
  const [skills, setSkills]               = useState([])
  const [activeCategory, setActiveCategory] = useState("All")
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  useEffect(() => {
    API.get("/skills")
      .then((res) => setSkills(Array.isArray(res.data) && res.data.length ? res.data : defaultSkills))
      .catch(() => setSkills(defaultSkills))
  }, [])

  const categories = ["All", ...new Set(skills.map((s) => s.category || "General"))]
  const filtered   = activeCategory === "All" ? skills : skills.filter((s) => (s.category || "General") === activeCategory)

  return (
    <section id="skills" className="relative px-6 md:px-16 py-20" ref={ref}>
      <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} className="text-center mb-14">
        <p className="section-tag mb-3">02 / skills</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold gradient-text">Technical Arsenal</h2>
        <p style={{ color: "#64748b", fontSize: 14, marginTop: 12 }}>Tools & technologies I work with every day</p>
      </motion.div>

      {/* Category filter pills */}
      <motion.div
        variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
        style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 40 }}
      >
        {categories.map((cat) => {
          const c = colors[cat] || colors.General
          const active = activeCategory === cat
          return (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              style={{
                padding: "8px 20px", borderRadius: 999, fontSize: 12, cursor: "pointer",
                fontFamily: "JetBrains Mono, monospace", fontWeight: 500,
                transition: "all 0.25s",
                background: active ? (colors[cat]?.bg || "rgba(34,211,238,0.1)") : "rgba(255,255,255,0.03)",
                border: `1px solid ${active ? (colors[cat]?.border || "rgba(34,211,238,0.4)") : "rgba(255,255,255,0.1)"}`,
                color: active ? (colors[cat]?.text || "#22d3ee") : "#64748b",
                boxShadow: active ? `0 0 16px ${colors[cat]?.glow || "rgba(34,211,238,0.2)"}` : "none",
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
          exit={{ opacity: 0, y: 10 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto"
        >
          {filtered.map((skill) => (
            <SkillBar
              key={skill._id || skill.name}
              name={skill.name} level={skill.level ?? 80}
              category={skill.category || "General"} animate={inView}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
