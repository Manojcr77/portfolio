import { FiHeart, FiGithub, FiLinkedin, FiMail, FiArrowUp } from "react-icons/fi"
import { motion } from "framer-motion"

const socials = [
  { Icon: FiGithub,   href: "https://github.com/manoj-cr",      label: "GitHub"   },
  { Icon: FiLinkedin, href: "https://linkedin.com/in/manoj-cr",  label: "LinkedIn" },
  { Icon: FiMail,     href: "mailto:manoj@example.com",           label: "Email"    },
]

export default function Footer() {
  return (
    <footer style={{
      position: "relative", borderTop: "1px solid rgba(255,255,255,0.06)",
      padding: "48px 24px 32px",
    }}>
      {/* Subtle top glow */}
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 300, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.4), transparent)",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 28,
        }}>
          {/* Logo + tagline */}
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800,
              background: "linear-gradient(135deg, #22d3ee, #a78bfa)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              marginBottom: 6,
            }}>
              Manoj C R
            </div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#334155", letterSpacing: "0.15em" }}>
              AI/ML ENGINEER · MERN STACK DEVELOPER
            </div>
          </div>

          {/* Social icons */}
          <div style={{ display: "flex", gap: 12 }}>
            {socials.map(({ Icon, href, label }) => (
              <motion.a
                key={label} href={href} target="_blank" rel="noreferrer"
                whileHover={{ y: -4, scale: 1.1 }}
                title={label}
                style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#475569", textDecoration: "none", transition: "all 0.25s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#22d3ee"; e.currentTarget.style.borderColor = "rgba(34,211,238,0.35)"; e.currentTarget.style.background = "rgba(34,211,238,0.07)" }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#475569"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)" }}
              >
                <Icon size={16} />
              </motion.a>
            ))}
          </div>

          {/* Built with */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#334155", fontSize: 12 }}>
            <span>Built with</span>
            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1 }}>
              <FiHeart size={12} color="#f87171" fill="#f87171" />
            </motion.div>
            <span>React · Three.js · Framer Motion</span>
          </div>

          {/* Copyright */}
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#1e293b", letterSpacing: "0.2em" }}>
            © 2026 MANOJ C R — ALL RIGHTS RESERVED
          </div>
        </div>
      </div>

      {/* Back to top */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        whileHover={{ scale: 1.1, y: -3 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: "absolute", bottom: 32, right: 24,
          width: 40, height: 40, borderRadius: 12,
          background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#22d3ee", cursor: "pointer", transition: "all 0.25s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(34,211,238,0.15)"; e.currentTarget.style.boxShadow = "0 0 16px rgba(34,211,238,0.25)" }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(34,211,238,0.08)"; e.currentTarget.style.boxShadow = "none" }}
      >
        <FiArrowUp size={16} />
      </motion.button>
    </footer>
  )
}
