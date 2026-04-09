// Top-left brand bar — visible on desktop
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const sections = [
  { label: "About",    href: "#about"    },
  { label: "Skills",   href: "#skills"   },
  { label: "Projects", href: "#projects" },
  { label: "Contact",  href: "#contact"  },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 998,
        padding: "0 32px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(2,6,23,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(34,211,238,0.08)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <a
        href="#home"
        style={{
          fontFamily: "Syne, sans-serif",
          fontWeight: 800,
          fontSize: 18,
          background: "linear-gradient(135deg, #22d3ee, #a78bfa)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textDecoration: "none",
        }}
      >
        Manoj.CR
      </a>

      <div style={{ display: "flex", gap: 8 }} className="hidden md:flex">
        {sections.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: 13,
              fontWeight: 500,
              color: "#94a3b8",
              textDecoration: "none",
              padding: "6px 14px",
              borderRadius: 8,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#22d3ee"; e.currentTarget.style.background = "rgba(34,211,238,0.06)" }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "transparent" }}
          >
            {label}
          </a>
        ))}
      </div>
    </motion.nav>
  )
}
