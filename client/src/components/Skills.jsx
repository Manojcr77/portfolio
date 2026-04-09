import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
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
  "AI/ML":   { text: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", bar: "from-violet-500 to-purple-400" },
  Frontend:  { text: "text-cyan-400",   bg: "bg-cyan-500/10",   border: "border-cyan-500/20",   bar: "from-cyan-500 to-blue-400"    },
  Backend:   { text: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-500/20",  bar: "from-green-500 to-emerald-400"},
  General:   { text: "text-slate-400",  bg: "bg-slate-500/10",  border: "border-slate-500/20",  bar: "from-slate-500 to-slate-400" },
}

function SkillBar({ name, level, category, animate }) {
  const c = colors[category] || colors.General
  return (
    <motion.div variants={fadeUp} className="glass rounded-xl p-4 border border-white/8 card-hover group">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-sm font-medium text-white mb-1">{name}</p>
          <span className={`inline-block mono text-[10px] px-2 py-0.5 rounded-full ${c.bg} ${c.border} ${c.text} border`}>{category}</span>
        </div>
        <span className={`font-display text-xl font-bold ${c.text}`}>{level}%</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-white/5">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${c.bar}`}
          initial={{ width: 0 }}
          animate={{ width: animate ? `${level}%` : 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
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
    <section id="skills" className="relative px-6 md:px-16 py-16" ref={ref}>
      <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} className="text-center mb-14">
        <p className="section-tag mb-3">02 / skills</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold gradient-text">Technical Arsenal</h2>
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} className="flex flex-wrap gap-2 justify-center mb-10">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`mono text-xs px-4 py-2 rounded-full border transition-all duration-300 ${activeCategory === cat ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-400" : "bg-white/3 border-white/10 text-slate-500 hover:text-slate-300"}`}>
            {cat}
          </button>
        ))}
      </motion.div>

      <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {filtered.map((skill) => (
          <SkillBar key={skill._id || skill.name} name={skill.name} level={skill.level ?? 80} category={skill.category || "General"} animate={inView} />
        ))}
      </motion.div>
    </section>
  )
}