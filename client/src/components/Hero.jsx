import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TypeAnimation } from "react-type-animation"
import { FiDownload, FiArrowDown, FiMail, FiLock, FiX } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import API from "../utils/api"

export default function Hero() {
  const [resumeUrl, setResumeUrl] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [password,  setPassword]  = useState("")
  const [error,     setError]     = useState("")
  const [loading,   setLoading]   = useState(false)
  const [mousePos,  setMousePos]  = useState({ x: 0, y: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    API.get("/resume").then((res) => {
      if (res.data?.path) setResumeUrl(res.data.path)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

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
    <section
      id="home"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "80px 24px 40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow orbs that follow mouse */}
      <motion.div
        animate={{ x: mousePos.x * 2, y: mousePos.y * 2 }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        style={{
          position: "absolute", top: "20%", left: "20%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)",
          pointerEvents: "none", filter: "blur(40px)",
        }}
      />
      <motion.div
        animate={{ x: -mousePos.x * 1.5, y: -mousePos.y * 1.5 }}
        transition={{ type: "spring", stiffness: 40, damping: 20 }}
        style={{
          position: "absolute", bottom: "20%", right: "20%",
          width: 350, height: 350, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)",
          pointerEvents: "none", filter: "blur(40px)",
        }}
      />

      {/* ── Password Modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
            style={{
              position: "fixed", inset: 0, zIndex: 1000,
              background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ type: "spring", damping: 18, stiffness: 200 }}
              style={{
                background: "linear-gradient(145deg, #0d1117, #0a0f1e)",
                border: "1px solid rgba(34,211,238,0.25)",
                borderRadius: 24, padding: "40px 36px",
                width: "100%", maxWidth: 380, position: "relative",
                boxShadow: "0 0 60px rgba(34,211,238,0.1), 0 40px 80px rgba(0,0,0,0.5)",
              }}
            >
              <button
                onClick={() => { setShowModal(false); setPassword(""); setError("") }}
                style={{
                  position: "absolute", top: 16, right: 16,
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8, color: "#475569", cursor: "pointer", padding: 6,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "rgba(255,255,255,0.1)" }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#475569"; e.currentTarget.style.background = "rgba(255,255,255,0.05)" }}
              >
                <FiX size={16} />
              </button>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(167,139,250,0.15))",
                border: "1px solid rgba(34,211,238,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
              }}>
                <FiLock size={22} color="#22d3ee" />
              </div>
              <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 20, color: "#f1f5f9", marginBottom: 6 }}>
                Admin Access
              </h2>
              <p style={{ color: "#64748b", fontSize: 13, marginBottom: 24 }}>Enter password to continue</p>
              <input
                type="password" value={password}
                onChange={(e) => { setPassword(e.target.value); setError("") }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Password" autoFocus
                style={{
                  width: "100%", background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${error ? "#f87171" : "rgba(34,211,238,0.2)"}`,
                  borderRadius: 12, padding: "13px 14px", color: "#f1f5f9",
                  fontSize: 14, fontFamily: "inherit", outline: "none",
                  boxSizing: "border-box", marginBottom: error ? 8 : 20,
                  transition: "border-color 0.2s",
                }}
              />
              {error && <p style={{ color: "#f87171", fontSize: 12, marginBottom: 16 }}>{error}</p>}
              <button
                onClick={handleLogin} disabled={loading}
                style={{
                  width: "100%",
                  background: loading ? "rgba(34,211,238,0.1)" : "linear-gradient(135deg, #0e7490, #5b21b6)",
                  border: "1px solid rgba(34,211,238,0.3)", borderRadius: 12,
                  padding: "13px", color: "#fff", fontWeight: 600, fontSize: 14,
                  fontFamily: "inherit", cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1, transition: "all 0.3s",
                }}
              >
                {loading ? "Verifying…" : "Enter Dashboard"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "backOut" }}
        style={{
          marginBottom: 32,
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "9px 20px", borderRadius: 999,
          border: "1px solid rgba(57,255,20,0.25)",
          color: "rgba(57,255,20,0.9)", fontSize: 11,
          letterSpacing: "0.18em", fontFamily: "JetBrains Mono, monospace",
          backdropFilter: "blur(12px)", background: "rgba(57,255,20,0.05)",
          boxShadow: "0 0 20px rgba(57,255,20,0.08)",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* shimmer sweep */}
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, transparent, rgba(57,255,20,0.15), transparent)",
            pointerEvents: "none",
          }}
        />
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{ width: 8, height: 8, borderRadius: "50%", background: "#39ff14", display: "inline-block" }}
        />
        OPEN TO OPPORTUNITIES
      </motion.div>

      {/* Name */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: "'Space Grotesk', 'Syne', sans-serif",
          fontSize: "clamp(2.6rem, 10vw, 6.5rem)",
          fontWeight: 800, lineHeight: 1.1, marginBottom: 20,
          whiteSpace: "nowrap",
          background: "linear-gradient(135deg, #22d3ee 0%, #a78bfa 60%, #22d3ee 100%)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          animation: "shimmerText 4s linear infinite",
          letterSpacing: "-0.02em",
        }}
      >
        Manoj.CR
        <span onClick={() => setShowModal(true)} style={{ cursor: "default" }}>.</span>
      </motion.h1>

      {/* Typewriter */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        style={{
          fontFamily: "Syne, sans-serif",
          fontSize: "clamp(0.95rem, 4vw, 1.65rem)",
          fontWeight: 600, color: "#22d3ee", marginBottom: 22,
          minHeight: 40, display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <TypeAnimation
          sequence={[
            "AI & Machine Learning Engineer", 2200,
            "MERN Stack Developer", 2000,
            "Cloud Computing Enthusiast", 2000,
            "4th Year AIML Student", 2000,
          ]}
          repeat={Infinity} cursor={true}
        />
      </motion.div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{
          color: "#94a3b8", maxWidth: 540,
          fontSize: "clamp(0.82rem, 3vw, 1rem)",
          lineHeight: 1.8, marginBottom: 40, padding: "0 8px",
        }}
      >
        Building intelligent systems at the intersection of{" "}
        <span style={{ color: "#a78bfa", fontWeight: 500 }}>AI/ML</span>,{" "}
        <span style={{ color: "#22d3ee", fontWeight: 500 }}>full-stack development</span>, and{" "}
        <span style={{ color: "#39ff14", fontWeight: 500 }}>cloud infrastructure</span>.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
        style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginBottom: 56 }}
      >
        <HeroBtn
          onClick={() => { window.location.href = "#projects" }}
          variant="primary"
        >
          View Projects
        </HeroBtn>

        <HeroBtn
          onClick={() => { if (resumeUrl) window.open(resumeUrl, "_blank") }}
          variant="outline"
          disabled={!resumeUrl}
          icon={<FiDownload size={14} />}
        >
          Resume
        </HeroBtn>

        <HeroBtn
          onClick={() => { window.location.href = "#contact" }}
          variant="ghost"
          icon={<FiMail size={14} />}
        >
          Contact
        </HeroBtn>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        style={{
          position: "absolute", bottom: 32, left: "50%",
          transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          color: "#334155",
        }}
      >
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: "0.22em" }}>SCROLL</span>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
          <FiArrowDown size={16} />
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes shimmerText {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </section>
  )
}

function HeroBtn({ children, onClick, variant = "primary", disabled = false, icon }) {
  const [hovered, setHovered] = useState(false)

  const base = {
    padding: "13px 28px", borderRadius: 14, fontWeight: 600,
    fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8,
    cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit",
    transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
    opacity: disabled ? 0.4 : 1, border: "none", position: "relative",
    overflow: "hidden", userSelect: "none",
  }

  const variants = {
    primary: {
      background: hovered
        ? "linear-gradient(135deg, #22d3ee, #a78bfa)"
        : "linear-gradient(135deg, #0e7490, #5b21b6)",
      color: "#fff",
      border: "1px solid rgba(34,211,238,0.4)",
      boxShadow: hovered ? "0 0 32px rgba(34,211,238,0.45), 0 8px 24px rgba(0,0,0,0.3)" : "0 0 16px rgba(34,211,238,0.15)",
      transform: hovered ? "translateY(-3px) scale(1.02)" : "translateY(0) scale(1)",
    },
    outline: {
      background: hovered ? "rgba(34,211,238,0.1)" : "transparent",
      color: "#22d3ee",
      border: "1px solid rgba(34,211,238,0.5)",
      boxShadow: hovered ? "0 0 24px rgba(34,211,238,0.25)" : "none",
      transform: hovered ? "translateY(-3px)" : "translateY(0)",
    },
    ghost: {
      background: hovered ? "rgba(255,255,255,0.07)" : "transparent",
      color: hovered ? "#e2e8f0" : "#94a3b8",
      border: "1px solid rgba(255,255,255,0.15)",
      transform: hovered ? "translateY(-3px)" : "translateY(0)",
    },
  }

  return (
    <button
      onClick={!disabled ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ ...base, ...variants[variant] }}
    >
      {icon}
      {children}
    </button>
  )
}
