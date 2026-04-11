import { useEffect, useState, useRef } from "react"
import { motion, useInView, useMotionValue, useSpring } from "framer-motion"
import { FiUser, FiBookOpen, FiTarget, FiCpu, FiGithub, FiLinkedin } from "react-icons/fi"
import API from "../utils/api"
import { fadeUp, fadeLeft, staggerContainer } from "../animations/variants"

const cards = [
  { icon: FiUser,     title: "Who I Am",     text: "A passionate 4th-year AIML Engineering student who loves bridging the gap between research and real-world software.", color: "cyan" },
  { icon: FiBookOpen, title: "Education",    text: "B.E. in Artificial Intelligence & Machine Learning — Final Year. Strong foundation in algorithms, neural networks, and data science.", color: "violet" },
  { icon: FiCpu,      title: "What I Build", text: "End-to-end AI/ML pipelines, scalable MERN applications, and cloud-native architectures on AWS, GCP, and Azure.", color: "cyan" },
  { icon: FiTarget,   title: "Career Goal",  text: "To work on cutting-edge AI products that solve real human problems, combining ML research with production-grade software engineering.", color: "violet" },
]

const stats = [
  { label: "Projects Built",    value: 4, suffix: "+" },
  { label: "Technologies",      value: 10, suffix: "+" },
  { label: "GitHub Commits",    value: 150, suffix: "+" },
]

function CountUp({ target, suffix, decimals = 0, active }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = 0
    const step = target / 60
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setDisplay(target); clearInterval(timer) }
      else setDisplay(start)
    }, 16)
    return () => clearInterval(timer)
  }, [active, target])
  return <>{decimals ? display.toFixed(decimals) : Math.floor(display)}{suffix}</>
}

export default function About() {
  const [description, setDescription] = useState("")
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    API.get("/about").then((res) => { if (res.data?.description) setDescription(res.data.description) }).catch(() => {})
  }, [])

  return (
    <section id="about" className="relative px-6 md:px-16 py-20" ref={ref} aria-label="About Manoj C R">
      <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} className="text-center mb-16">
        <p className="section-tag mb-3">01 / about me</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold gradient-text">The Engineer Behind the Code</h2>
      </motion.div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-start">
        {/* Left column */}
        <motion.div variants={fadeLeft} initial="hidden" animate={inView ? "visible" : "hidden"} className="flex flex-col items-center md:items-start gap-8">
          
          {/* Avatar with glow ring */}
          <div style={{ position: "relative", display: "inline-block" }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute", inset: -4, borderRadius: "28px",
                background: "linear-gradient(135deg, #22d3ee, transparent, #a78bfa, transparent, #22d3ee)",
                padding: 2, zIndex: 0,
              }}
            />
            <div style={{
              position: "relative", zIndex: 1,
              width: 200, height: 200, borderRadius: 24,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden",
            }}>
              <div style={{ fontSize: 72, lineHeight: 1, userSelect: "none" }}>🧑🏿‍💻</div>
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 3,
                background: "linear-gradient(90deg, #22d3ee, #a78bfa)",
              }} />
            </div>
          </div>

          {/* Bio card */}
          <div className="glass rounded-2xl p-6 border border-white/8 max-w-md w-full" style={{ boxShadow: "0 0 40px rgba(34,211,238,0.05)" }}>
            <p className="text-slate-300 leading-relaxed text-sm">
              {description || <>Hi, I&apos;m <span className="text-cyan-400 font-semibold">Manoj C R</span> — an <span className="text-violet-400">AI/ML Engineer</span> and full-stack developer based in India. He specializes in building intelligent, scalable systems using modern web technologies and machine learning frameworks.</>}
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-md">
            {stats.map(({ label, value, suffix, decimals }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className="glass rounded-xl p-4 border border-white/8 text-center"
                style={{ transition: "border-color 0.3s, box-shadow 0.3s" }}
                whileHover={{ borderColor: "rgba(34,211,238,0.3)", boxShadow: "0 0 20px rgba(34,211,238,0.1)" }}
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
              { Icon: FiGithub,   href: "https://github.com/manoj-cr",   label: "GitHub"   },
              { Icon: FiLinkedin, href: "https://linkedin.com/in/manoj-cr", label: "LinkedIn" },
            ].map(({ Icon, href, label }) => (
              <motion.a
                key={label} href={href} target="_blank" rel="noreferrer"
                whileHover={{ y: -3, scale: 1.05 }}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 18px", borderRadius: 12,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#94a3b8", fontSize: 13, textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#22d3ee"; e.currentTarget.style.borderColor = "rgba(34,211,238,0.3)" }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)" }}
              >
                <Icon size={15} /> {label}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Right: cards grid */}
        <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map(({ icon: Icon, title, text, color }) => (
            <motion.div
              key={title} variants={fadeUp}
              className="glass rounded-2xl p-5 border border-white/8 group"
              style={{ cursor: "default", transition: "all 0.35s" }}
              whileHover={{
                y: -6,
                boxShadow: color === "cyan"
                  ? "0 16px 40px rgba(0,0,0,0.3), 0 0 24px rgba(34,211,238,0.12)"
                  : "0 16px 40px rgba(0,0,0,0.3), 0 0 24px rgba(167,139,250,0.12)",
                borderColor: color === "cyan" ? "rgba(34,211,238,0.25)" : "rgba(167,139,250,0.25)",
              }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 12, marginBottom: 16,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: color === "cyan" ? "rgba(34,211,238,0.08)" : "rgba(167,139,250,0.08)",
                border: `1px solid ${color === "cyan" ? "rgba(34,211,238,0.2)" : "rgba(167,139,250,0.2)"}`,
                transition: "all 0.3s",
              }}>
                <Icon size={18} color={color === "cyan" ? "#22d3ee" : "#a78bfa"} />
              </div>
              <h3 className="font-display font-semibold text-white mb-2 text-sm">{title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
