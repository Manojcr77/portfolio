import { useEffect, useState, useRef, useCallback } from "react"
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from "framer-motion"
import { TypeAnimation } from "react-type-animation"
import { FiDownload, FiArrowDown, FiMail, FiLock, FiX } from "react-icons/fi"
import API from "../utils/api"

/* ── Floating particle ─────────────────────────── */
function Particle({ style }) {
  return <div className="particle" style={style} />
}

/* ── Magnetic button ───────────────────────────── */
function MagneticBtn({ children, onClick, variant = "primary", disabled = false, icon }) {
  const ref = useRef(null)
  const x   = useMotionValue(0)
  const y   = useMotionValue(0)
  const sx  = useSpring(x, { stiffness: 200, damping: 18 })
  const sy  = useSpring(y, { stiffness: 200, damping: 18 })
  const [hovered, setHovered] = useState(false)

  const onMove = useCallback((e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width  / 2) * 0.35)
    y.set((e.clientY - rect.top  - rect.height / 2) * 0.35)
  }, [x, y])

  const onLeave = () => { x.set(0); y.set(0); setHovered(false) }

  const styles = {
    primary: {
      background: hovered
        ? "linear-gradient(135deg, #22d3ee, #a78bfa)"
        : "linear-gradient(135deg, #0e7490, #5b21b6)",
      color: "#fff",
      border: "1px solid rgba(34,211,238,0.4)",
      boxShadow: hovered ? "0 0 40px rgba(34,211,238,0.5), 0 12px 32px rgba(0,0,0,0.4)" : "0 0 16px rgba(34,211,238,0.15)",
    },
    outline: {
      background: hovered ? "rgba(34,211,238,0.1)" : "transparent",
      color: "#22d3ee",
      border: "1px solid rgba(34,211,238,0.5)",
      boxShadow: hovered ? "0 0 28px rgba(34,211,238,0.3)" : "none",
    },
    ghost: {
      background: hovered ? "rgba(255,255,255,0.07)" : "transparent",
      color: hovered ? "#e2e8f0" : "#94a3b8",
      border: "1px solid rgba(255,255,255,0.15)",
      boxShadow: "none",
    },
  }

  return (
    <motion.button
      ref={ref}
      onClick={!disabled ? onClick : undefined}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      disabled={disabled}
      style={{
        x: sx, y: sy,
        padding: "14px 30px", borderRadius: 14,
        fontWeight: 600, fontSize: 14,
        display: "inline-flex", alignItems: "center", gap: 8,
        cursor: disabled ? "not-allowed" : "none",
        fontFamily: "inherit", opacity: disabled ? 0.4 : 1,
        transition: "background 0.3s, box-shadow 0.3s, color 0.3s, border-color 0.3s",
        position: "relative", overflow: "hidden",
        ...styles[variant],
      }}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {/* Beam sweep on hover */}
      <motion.div
        initial={{ left: "-60%" }}
        animate={{ left: hovered ? "120%" : "-60%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "-50%", width: "40%", height: "200%",
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)",
          transform: "skewX(-20deg)", pointerEvents: "none",
        }}
      />
      {icon && <span style={{ display: "flex" }}>{icon}</span>}
      {children}
    </motion.button>
  )
}

/* ── Floating particles config ─────────────────── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  key: i,
  style: {
    width:  Math.random() * 4 + 2 + "px",
    height: Math.random() * 4 + 2 + "px",
    left:   Math.random() * 100 + "%",
    background: i % 3 === 0 ? "#22d3ee" : i % 3 === 1 ? "#a78bfa" : "#39ff14",
    animationDuration: Math.random() * 12 + 8 + "s",
    animationDelay:    Math.random() * 8 + "s",
    filter: "blur(0.5px)",
    opacity: 0,
  },
}))

/* ── Hero ──────────────────────────────────────── */
export default function Hero() {
  const [resumeUrl, setResumeUrl] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [password,  setPassword]  = useState("")
  const [error,     setError]     = useState("")
  const [loading,   setLoading]   = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const orb1X  = useSpring(useTransform(mouseX, [-1, 1], [-30, 30]), { stiffness: 30, damping: 15 })
  const orb1Y  = useSpring(useTransform(mouseY, [-1, 1], [-30, 30]), { stiffness: 30, damping: 15 })
  const orb2X  = useSpring(useTransform(mouseX, [-1, 1], [20, -20]), { stiffness: 25, damping: 15 })
  const orb2Y  = useSpring(useTransform(mouseY, [-1, 1], [20, -20]), { stiffness: 25, damping: 15 })

  useEffect(() => {
    API.get("/resume").then((r) => { if (r.data?.path) setResumeUrl(r.data.path) }).catch(() => {})
  }, [])

  useEffect(() => {
    const onMove = (e) => {
      mouseX.set((e.clientX / window.innerWidth  - 0.5) * 2)
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2)
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [mouseX, mouseY])

  const handleLogin = async () => {
    if (!password.trim()) { setError("Enter password"); return }
    setLoading(true); setError("")
    try {
      const res = await API.post("/auth/admin-login", { password })
      localStorage.setItem("token", res.data.token)
      setShowModal(false); setPassword("")
      window.open("/admin", "_blank")
    } catch (err) {
      setError(err.response?.data?.message || "Wrong password. Try again.")
    } finally { setLoading(false) }
  }

  return (
    <section id="home" style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      textAlign: "center", padding: "80px 24px 40px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Floating particles */}
      {PARTICLES.map((p) => <Particle key={p.key} style={p.style} />)}

      {/* Parallax ambient orbs */}
      <motion.div style={{ x: orb1X, y: orb1Y, position: "absolute", top: "15%", left: "15%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.09) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(50px)" }} />
      <motion.div style={{ x: orb2X, y: orb2Y, position: "absolute", bottom: "15%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(50px)" }} />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(57,255,20,0.05) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(60px)" }}
      />

      {/* ── Modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
            style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1,   y: 0  }}
              exit={{    opacity: 0, scale: 0.8, y: 40 }}
              transition={{ type: "spring", damping: 18, stiffness: 220 }}
              style={{ background: "linear-gradient(145deg, #0d1117, #0a0f1e)", border: "1px solid rgba(34,211,238,0.25)", borderRadius: 24, padding: "40px 36px", width: "100%", maxWidth: 380, position: "relative", boxShadow: "0 0 80px rgba(34,211,238,0.12), 0 40px 80px rgba(0,0,0,0.6)" }}
            >
              <button onClick={() => { setShowModal(false); setPassword(""); setError("") }}
                style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#475569", cursor: "none", padding: 6, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#94a3b8" }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#475569" }}
              >
                <FiX size={16} />
              </button>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(167,139,250,0.15))", border: "1px solid rgba(34,211,238,0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <FiLock size={22} color="#22d3ee" />
              </div>
              <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 20, color: "#f1f5f9", marginBottom: 6 }}>Admin Access</h2>
              <p style={{ color: "#64748b", fontSize: 13, marginBottom: 24 }}>Enter password to continue</p>
              <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError("") }} onKeyDown={(e) => e.key === "Enter" && handleLogin()} placeholder="Password" autoFocus
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${error ? "#f87171" : "rgba(34,211,238,0.2)"}`, borderRadius: 12, padding: "13px 14px", color: "#f1f5f9", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: error ? 8 : 20 }}
              />
              {error && <p style={{ color: "#f87171", fontSize: 12, marginBottom: 16 }}>{error}</p>}
              <button onClick={handleLogin} disabled={loading}
                style={{ width: "100%", background: "linear-gradient(135deg, #0e7490, #5b21b6)", border: "1px solid rgba(34,211,238,0.3)", borderRadius: 12, padding: "13px", color: "#fff", fontWeight: 600, fontSize: 14, fontFamily: "inherit", cursor: "none", opacity: loading ? 0.7 : 1, transition: "all 0.3s" }}
              >
                {loading ? "Verifying…" : "Enter Dashboard"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: -20 }}
        animate={{ opacity: 1, scale: 1,   y: 0   }}
        transition={{ duration: 0.7, ease: "backOut" }}
        style={{ marginBottom: 36, display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 999, border: "1px solid rgba(57,255,20,0.25)", color: "rgba(57,255,20,0.9)", fontSize: 11, letterSpacing: "0.18em", fontFamily: "JetBrains Mono, monospace", backdropFilter: "blur(12px)", background: "rgba(57,255,20,0.05)", boxShadow: "0 0 24px rgba(57,255,20,0.1)", position: "relative", overflow: "hidden" }}
      >
        <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
          style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent, rgba(57,255,20,0.2), transparent)", pointerEvents: "none" }}
        />
        <motion.span animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }} transition={{ duration: 1.8, repeat: Infinity }}
          style={{ width: 8, height: 8, borderRadius: "50%", background: "#39ff14", display: "inline-block" }}
        />
        OPEN TO OPPORTUNITIES
      </motion.div>

      {/* Name — letter by letter reveal */}
      <div style={{ overflow: "hidden", marginBottom: 20 }}>
        <motion.h1
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="gradient-text-animated"
          style={{
            fontFamily: "'Space Grotesk', 'Syne', sans-serif",
            fontSize: "clamp(2.8rem, 10vw, 7rem)",
            fontWeight: 800, lineHeight: 1.05,
            whiteSpace: "nowrap", letterSpacing: "-0.03em",
            cursor: "default",
          }}
        >
          Manoj.CR
          <span onClick={() => setShowModal(true)} style={{ cursor: "none" }}>.</span>
        </motion.h1>
      </div>

      {/* Typewriter */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(0.95rem, 4vw, 1.7rem)", fontWeight: 600, color: "#22d3ee", marginBottom: 24, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <TypeAnimation
          sequence={["AI & Machine Learning Engineer", 2200, "MERN Stack Developer", 2000, "Cloud Computing Enthusiast", 2000, "4th Year AIML Student", 2000]}
          repeat={Infinity} cursor={true}
        />
      </motion.div>

      {/* Description with word highlight */}
      <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
        style={{ color: "#94a3b8", maxWidth: 540, fontSize: "clamp(0.82rem, 3vw, 1rem)", lineHeight: 1.85, marginBottom: 44, padding: "0 8px" }}
      >
        Building intelligent systems at the intersection of{" "}
        <motion.span whileHover={{ color: "#c4b5fd" }} style={{ color: "#a78bfa", fontWeight: 500, transition: "color 0.2s" }}>AI/ML</motion.span>,{" "}
        <motion.span whileHover={{ color: "#67e8f9" }} style={{ color: "#22d3ee", fontWeight: 500, transition: "color 0.2s" }}>full-stack development</motion.span>, and{" "}
        <motion.span whileHover={{ color: "#86efac" }} style={{ color: "#39ff14", fontWeight: 500, transition: "color 0.2s" }}>cloud infrastructure</motion.span>.
      </motion.p>

      {/* Magnetic buttons */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
        style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginBottom: 60 }}
      >
        <MagneticBtn onClick={() => { window.location.href = "#projects" }} variant="primary">
          View Projects
        </MagneticBtn>
        <MagneticBtn onClick={() => { if (resumeUrl) window.open(resumeUrl, "_blank") }} variant="outline" disabled={!resumeUrl} icon={<FiDownload size={14} />}>
          Resume
        </MagneticBtn>
        <MagneticBtn onClick={() => { window.location.href = "#contact" }} variant="ghost" icon={<FiMail size={14} />}>
          Contact
        </MagneticBtn>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: "#1e293b" }}
      >
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: "0.22em" }}>SCROLL</span>
        <motion.div animate={{ y: [0, 12, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
          <FiArrowDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  )
}
