import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiMenu, FiX, FiHome, FiUser, FiCpu, FiCode, FiMail } from "react-icons/fi"

const sections = [
  { label: "Home",     href: "#home",     Icon: FiHome },
  { label: "About",    href: "#about",    Icon: FiUser },
  { label: "Skills",   href: "#skills",   Icon: FiCpu  },
  { label: "Projects", href: "#projects", Icon: FiCode },
  { label: "Contact",  href: "#contact",  Icon: FiMail },
]

export default function FloatingNav() {
  const [open, setOpen] = useState(false)

  const go = (href) => {
    setOpen(false)
    setTimeout(() => { window.location.href = href }, 100)
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        right: 24,
        zIndex: 999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 10,
      }}
    >
      {/* Menu items — shown when open */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              alignItems: "flex-end",
            }}
          >
            {sections.map(({ label, href, Icon }, i) => (
              <motion.button
                key={label}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => go(href)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 16px",
                  borderRadius: 12,
                  background: "rgba(10,15,30,0.92)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(34,211,238,0.2)",
                  color: "#e2e8f0",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontFamily: "DM Sans, sans-serif",
                  transition: "all 0.2s",
                  minWidth: 130,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(34,211,238,0.6)"
                  e.currentTarget.style.color = "#22d3ee"
                  e.currentTarget.style.background = "rgba(34,211,238,0.08)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(34,211,238,0.2)"
                  e.currentTarget.style.color = "#e2e8f0"
                  e.currentTarget.style.background = "rgba(10,15,30,0.92)"
                }}
              >
                <Icon size={15} />
                {label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button — always visible */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileTap={{ scale: 0.9 }}
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: open
            ? "linear-gradient(135deg, #22d3ee, #a78bfa)"
            : "rgba(10,15,30,0.92)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(34,211,238,0.4)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: open
            ? "0 0 28px rgba(34,211,238,0.5)"
            : "0 0 18px rgba(34,211,238,0.25)",
          transition: "all 0.3s",
          flexShrink: 0,
        }}
      >
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {open ? <FiX size={20} /> : <FiMenu size={20} />}
        </motion.div>
      </motion.button>
    </div>
  )
}