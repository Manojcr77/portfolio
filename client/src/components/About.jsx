import { useEffect, useState, useRef, useCallback } from "react"
import { motion, useInView } from "framer-motion"
import { FiUser, FiBookOpen, FiTarget, FiCpu, FiGithub, FiLinkedin } from "react-icons/fi"
import API from "../utils/api"
import { fadeUp, fadeLeft, staggerContainer } from "../animations/variants"

const cards = [
  { icon: FiUser,     title: "Who I Am",     text: "A passionate 4th-year AIML Engineering student who loves bridging the gap between research and real-world software.", color: "cyan"   },
  { icon: FiBookOpen, title: "Education",    text: "B.E. in Artificial Intelligence & Machine Learning — Final Year. Strong foundation in algorithms, neural networks, and data science.", color: "violet" },
  { icon: FiCpu,      title: "What I Build", text: "End-to-end AI/ML pipelines, scalable MERN applications, and cloud-native architectures on AWS, GCP, and Azure.", color: "cyan"   },
  { icon: FiTarget,   title: "Career Goal",  text: "To work on cutting-edge AI products that solve real human problems, combining ML research with production-grade software engineering.", color: "violet" },
]

const stats = [
  { label: "Projects Built",  value: 4,   suffix: "+" },
  { label: "Technologies",    value: 10,  suffix: "+" },
  { label: "GitHub Commits",  value: 150, suffix: "+" },
]

function CountUp({ target, suffix, decimals = 0, active }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = 0; const step = target / 60
    const t = setInterval(() => {
      start += step
      if (start >= target) { setDisplay(target); clearInterval(t) }
      else setDisplay(start)
    }, 16)
    return () => clearInterval(t)
  }, [active, target])
  return <>{decimals ? display.toFixed(decimals) : Math.floor(display)}{suffix}</>
}

/* ── 3D tilt card ──────────────────────────────── */
function TiltCard({ children, colorKey }) {
  const ref = useRef(null)
  const [style, setStyle] = useState({})
  const glowColor = colorKey === "cyan" ? "rgba(34,211,238,0.15)" : "rgba(167,139,250,0.15)"
  const borderHover = colorKey === "cyan" ? "rgba(34,211,238,0.3)" : "rgba(167,139,250,0.3)"

  const onMove = useCallback((e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width  - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    setStyle({
      transform: `perspective(600px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(10px)`,
      border: `1px solid ${borderHover}`,
      boxShadow: `0 20px 50px rgba(0,0,0,0.4), 0 0 30px ${glowColor}`,
      background: colorKey === "cyan" ? "rgba(34,211,238,0.05)" : "rgba(167,139,250,0.05)",
    })
  }, [borderHover, glowColor, colorKey])

  const onLeave = () => setStyle({})

  return (
    <motion.div
      ref={ref} variants={fadeUp}
      onMouseMove={onMove} onMouseLeave={onLeave}
      style={{
        borderRadius: 20, padding: "20px", border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)", cursor: "default",
        transition: "box-shadow 0.3s, border 0.3s, background 0.3s",
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {children}
    </motion.div>
  )
}

export default function About() {
  const [description, setDescription] = useState("")
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    API.get("/about").then((r) => { if (r.data?.description) setDescription(r.data.description) }).catch(() => {})
  }, [])

  return (
    <section id="about" className="relative px-6 md:px-16 py-20" ref={ref} aria-label="About Manoj C R">

      {/* Section header */}
      <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} className="text-center mb-16">
        <p className="section-tag mb-3">01 / about me</p>
        <div style={{ overflow: "hidden" }}>
          <motion.h2
            initial={{ y: "100%", opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold gradient-text"
          >
            The Engineer Behind the Code
          </motion.h2>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-start">
        {/* Left */}
        <motion.div variants={fadeLeft} initial="hidden" animate={inView ? "visible" : "hidden"} className="flex flex-col items-center md:items-start gap-8">

          {/* Avatar */}
          <div style={{ position: "relative" }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              style={{ position: "absolute", inset: -3, borderRadius: 28, background: "conic-gradient(from 0deg, #22d3ee, transparent 40%, #a78bfa, transparent 80%, #22d3ee)", zIndex: 0 }}
            />
            <motion.div
              whileHover={{ scale: 1.04 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{ position: "relative", zIndex: 1, width: 200, height: 200, borderRadius: 24, background: "rgba(10,15,30,0.9)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}
            >
              <div style={{ fontSize: 76, lineHeight: 1, userSelect: "none" }}>🧑🏿‍💻</div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #22d3ee, #a78bfa)" }} />
            </motion.div>
          </div>

          {/* Bio */}
          <motion.div
            whileHover={{ borderColor: "rgba(34,211,238,0.2)" }}
            className="glass rounded-2xl p-6 border border-white/8 max-w-md w-full"
            style={{ transition: "border-color 0.3s" }}
          >
            <p className="text-slate-300 leading-relaxed text-sm">
              {description || <>Hi, I&apos;m <span className="text-cyan-400 font-semibold">Manoj C R</span> — an <span className="text-violet-400">AI/ML Engineer</span> and full-stack developer based in India. Specializing in building intelligent, scalable systems using modern web technologies and machine learning frameworks.</>}
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-md">
            {stats.map(({ label, value, suffix, decimals }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 200, damping: 15 }}
                whileHover={{ scale: 1.05, borderColor: "rgba(34,211,238,0.3)", boxShadow: "0 0 20px rgba(34,211,238,0.1)" }}
                className="glass rounded-xl p-4 border border-white/8 text-center"
                style={{ transition: "border-color 0.3s, box-shadow 0.3s" }}
              >
                <div className="font-display text-2xl font-bold gradient-text">
                  <CountUp target={value} suffix={suffix} decimals={decimals} active={inView} />
                </div>
                <div className="text-slate-500 text-xs mt-1 font-medium">{label}</div>
              </motion.div>
            ))}
          </div>

          {/* Social links */}
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { Icon: FiGithub,   href: "https://github.com/Manojcr77",     label: "GitHub"   },
              { Icon: FiLinkedin, href: "https://www.linkedin.com/in/manoj-cr-251028333/", label: "LinkedIn" },
            ].map(({ Icon, href, label }) => (
              <motion.a
                key={label} href={href} target="_blank" rel="noreferrer"
                whileHover={{ y: -4, scale: 1.05, borderColor: "rgba(34,211,238,0.4)", color: "#22d3ee" }}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", fontSize: 13, textDecoration: "none", transition: "all 0.25s", cursor: "none" }}
              >
                <Icon size={15} /> {label}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Right: 3D tilt cards */}
        <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map(({ icon: Icon, title, text, color }) => (
            <TiltCard key={title} colorKey={color}>
              <div style={{ width: 42, height: 42, borderRadius: 12, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", background: color === "cyan" ? "rgba(34,211,238,0.08)" : "rgba(167,139,250,0.08)", border: `1px solid ${color === "cyan" ? "rgba(34,211,238,0.2)" : "rgba(167,139,250,0.2)"}` }}>
                <Icon size={18} color={color === "cyan" ? "#22d3ee" : "#a78bfa"} />
              </div>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, color: "#f1f5f9", fontSize: 14, marginBottom: 8 }}>{title}</h3>
              <p style={{ color: "#64748b", fontSize: 12, lineHeight: 1.7 }}>{text}</p>
            </TiltCard>
          ))}
        </motion.div>
      </div>
    </section>
  )
}