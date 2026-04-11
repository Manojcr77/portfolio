import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiArrowLeft, FiGithub, FiExternalLink, FiCode, FiX, FiZoomIn } from "react-icons/fi"
import API from "../utils/api"
import CursorEffect from "../components/CursorEffect"

export default function ProjectDetails() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const [project,  setProject]  = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(false)
  const [lightbox, setLightbox] = useState(false)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    API.get(`/projects/${id}`)
      .then(res => setProject(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  // Lock scroll when lightbox open
  useEffect(() => {
    if (lightbox) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [lightbox])

  // Close lightbox on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setLightbox(false) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const goBack = () => {
    const y = sessionStorage.getItem("scrollY")
    navigate("/")
    if (y) setTimeout(() => window.scrollTo({ top: Number(y) }), 100)
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617" }}>
      <CursorEffect />
      <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(34,211,238,0.2)", borderTopColor: "#22d3ee", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (error || !project) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#020617", color: "#94a3b8", gap: 16 }}>
      <CursorEffect />
      <FiCode size={48} style={{ color: "#334155" }} />
      <p style={{ fontFamily: "Syne, sans-serif", fontSize: 20, color: "#e2e8f0" }}>Project not found</p>
      <button onClick={goBack} style={{ color: "#22d3ee", background: "transparent", border: "none", cursor: "none", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
        <FiArrowLeft size={14} /> Back to portfolio
      </button>
    </div>
  )

  const techList = project.tech?.split("·").map(t => t.trim()).filter(Boolean) ?? []
  const showImage = project.image && !imgError

  return (
    <div style={{ minHeight: "100vh", background: "#020617", padding: "0 0 80px" }}>

      {/* Cursor */}
      <CursorEffect />

      {/* Ambient background glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(34,211,238,0.07), transparent)",
      }} />

      {/* Back button */}
      <div style={{ padding: "24px 32px", position: "relative", zIndex: 1 }}>
        <button
          onClick={goBack}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            color: "#94a3b8", background: "transparent", border: "none",
            cursor: "none", fontSize: 14, fontFamily: "DM Sans, sans-serif",
            padding: "8px 0", transition: "color 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#22d3ee"}
          onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}
        >
          <FiArrowLeft size={16} /> Back to Portfolio
        </button>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>

        {/* Hero image */}
        {showImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setLightbox(true)}
            style={{
              borderRadius: 20, overflow: "hidden", marginBottom: 40,
              border: "1px solid rgba(255,255,255,0.08)",
              cursor: "zoom-in", position: "relative",
              boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
            }}
          >
            <img
              src={project.image}
              alt={project.title}
              onError={() => setImgError(true)}
              style={{ width: "100%", maxHeight: 420, objectFit: "cover", display: "block", transition: "transform 0.4s ease" }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            />
            {/* Zoom hint overlay */}
            <div style={{
              position: "absolute", bottom: 12, right: 12,
              background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 8, padding: "6px 10px",
              display: "flex", alignItems: "center", gap: 6,
              color: "rgba(255,255,255,0.7)", fontSize: 12,
              fontFamily: "DM Sans, sans-serif",
            }}>
              <FiZoomIn size={13} /> Click to expand
            </div>
          </motion.div>
        )}

        {/* Lightbox */}
        <AnimatePresence>
          {lightbox && (
            <motion.div
              key="lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setLightbox(false)}
              style={{
                position: "fixed", inset: 0, zIndex: 99999,
                background: "rgba(2,6,23,0.95)", backdropFilter: "blur(20px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "zoom-out", padding: 24,
              }}
            >
              <motion.img
                key="lightbox-img"
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                src={project.image}
                alt={project.title}
                onClick={e => e.stopPropagation()}
                style={{
                  maxWidth: "90vw", maxHeight: "88vh",
                  borderRadius: 16, objectFit: "contain",
                  boxShadow: "0 0 0 1px rgba(34,211,238,0.2), 0 40px 120px rgba(0,0,0,0.8), 0 0 80px rgba(34,211,238,0.12)",
                  cursor: "default",
                }}
              />
              {/* Close button */}
              <button
                onClick={() => setLightbox(false)}
                style={{
                  position: "fixed", top: 20, right: 20,
                  width: 44, height: 44, borderRadius: "50%",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "#e2e8f0", display: "flex", alignItems: "center",
                  justifyContent: "center", cursor: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(34,211,238,0.15)"; e.currentTarget.style.borderColor = "rgba(34,211,238,0.4)" }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)" }}
              >
                <FiX size={18} />
              </button>
              {/* Press ESC hint */}
              <div style={{
                position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
                fontFamily: "JetBrains Mono, monospace", fontSize: 11,
                color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em",
              }}>
                ESC to close
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>

          {/* Title */}
          <h1 style={{
            fontFamily: "Syne, sans-serif", fontWeight: 800,
            fontSize: "clamp(1.8rem, 5vw, 3rem)",
            background: "linear-gradient(135deg, #22d3ee, #a78bfa)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            marginBottom: 20, lineHeight: 1.2,
          }}>
            {project.title}
          </h1>

          {/* Tech stack */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
            {techList.map(t => (
              <span key={t} style={{
                fontFamily: "JetBrains Mono, monospace", fontSize: 11,
                padding: "4px 12px", borderRadius: 999,
                background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)",
                color: "rgba(34,211,238,0.8)",
              }}>{t}</span>
            ))}
          </div>

          {/* Description */}
          <div style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16, padding: "28px 32px", marginBottom: 32,
          }}>
            <p style={{ color: "#cbd5e1", lineHeight: 1.8, fontSize: 15, fontFamily: "DM Sans, sans-serif", margin: 0 }}>
              {project.description}
            </p>
          </div>

          {/* Links */}
          {(project.github || project.live) && (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {project.github && (
                <a
                  href={project.github} target="_blank" rel="noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "12px 24px", borderRadius: 12, textDecoration: "none",
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
                    color: "#e2e8f0", fontSize: 14, fontWeight: 600, fontFamily: "DM Sans, sans-serif",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,211,238,0.4)"; e.currentTarget.style.color = "#22d3ee" }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#e2e8f0" }}
                >
                  <FiGithub size={16} /> View Code
                </a>
              )}
              {project.live && (
                <a
                  href={project.live} target="_blank" rel="noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "12px 24px", borderRadius: 12, textDecoration: "none",
                    background: "linear-gradient(135deg, #0e7490, #5b21b6)", border: "1px solid rgba(34,211,238,0.3)",
                    color: "#fff", fontSize: 14, fontWeight: 600, fontFamily: "DM Sans, sans-serif",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  <FiExternalLink size={16} /> Live Demo
                </a>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}