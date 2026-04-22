import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import toast from "react-hot-toast"
import { FiSend, FiUser, FiMail, FiMessageSquare, FiGithub, FiLinkedin, FiTwitter, FiMapPin, FiClock } from "react-icons/fi"
import { fadeUp, fadeLeft, fadeRight } from "../animations/variants"
import API from "../utils/api"

const socials = [
  { Icon: FiGithub,   label: "GitHub",   href: "https://github.com/Manojcr77",     color: "#f1f5f9" },
  { Icon: FiLinkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/manoj-cr-251028333/", color: "#0ea5e9" },
  { Icon: FiMail,     label: "Email",    href: "mailto:manoj@example.com",          color: "#22d3ee" },
]

export default function Contact() {
  const [form, setForm]       = useState({ name: "", email: "", message: "" })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(null)
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = "Name is required"
    if (!form.email.trim())   e.email   = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email"
    if (!form.message.trim()) e.message = "Message is required"
    return e
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: "" })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await API.post("/contact", form)
      toast.success("Message sent! I'll get back to you soon 🚀")
      setForm({ name: "", email: "", message: "" })
    } catch { toast.error("Failed to send. Try again.") }
    finally { setLoading(false) }
  }

  const inputStyle = (field) => ({
    width: "100%", background: focused === field ? "rgba(34,211,238,0.04)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${errors[field] ? "rgba(248,113,113,0.6)" : focused === field ? "rgba(34,211,238,0.5)" : "rgba(255,255,255,0.1)"}`,
    borderRadius: 12, padding: "13px 14px 13px 40px", color: "#f1f5f9",
    fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
    transition: "all 0.3s",
    boxShadow: focused === field ? "0 0 0 3px rgba(34,211,238,0.08)" : "none",
  })

  return (
    <section id="contact" className="relative min-h-screen px-6 md:px-16 py-28" ref={ref}>
      <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} className="text-center mb-16">
        <p className="section-tag mb-3">04 / contact</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold gradient-text">Let&apos;s Work Together</h2>
        <p style={{ color: "#64748b", fontSize: 14, marginTop: 12 }}>Open to opportunities, collaborations, and interesting conversations</p>
      </motion.div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* Left info panel */}
        <motion.div variants={fadeLeft} initial="hidden" animate={inView ? "visible" : "hidden"} className="flex flex-col gap-5">

          {/* Location card */}
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 18, padding: "22px 24px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <FiMapPin size={15} color="#22d3ee" />
              </div>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, color: "#f1f5f9", fontSize: 15 }}>Based in India</h3>
            </div>
            <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.7 }}>
              Open to remote roles, internships, and full-time AI/ML or full-stack positions globally.
            </p>
          </div>

          {/* Availability card */}
          <div style={{
            background: "rgba(57,255,20,0.04)", border: "1px solid rgba(57,255,20,0.15)",
            borderRadius: 18, padding: "22px 24px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "rgba(57,255,20,0.08)", border: "1px solid rgba(57,255,20,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <FiClock size={15} color="#39ff14" />
              </div>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, color: "#f1f5f9", fontSize: 15 }}>Currently Available</h3>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                style={{ width: 8, height: 8, borderRadius: "50%", background: "#39ff14", display: "inline-block" }}
              />
              <span style={{ color: "rgba(57,255,20,0.8)", fontSize: 13, fontFamily: "JetBrains Mono, monospace" }}>
                Open to Opportunities
              </span>
            </div>
          </div>

          {/* Social links */}
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 18, padding: "22px 24px",
          }}>
            <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, color: "#f1f5f9", fontSize: 15, marginBottom: 16 }}>
              Find me online
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {socials.map(({ Icon, label, href, color }) => (
                <motion.a
                  key={label} href={href} target="_blank" rel="noreferrer"
                  whileHover={{ x: 4 }}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 14px", borderRadius: 12,
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                    textDecoration: "none", color: "#94a3b8", fontSize: 13, transition: "all 0.25s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = color; e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)" }}
                >
                  <Icon size={16} />
                  <span style={{ fontWeight: 500 }}>{label}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: form */}
        <motion.form
          variants={fadeRight} initial="hidden" animate={inView ? "visible" : "hidden"}
          onSubmit={handleSubmit} noValidate
          style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20, padding: "32px 28px", display: "flex", flexDirection: "column", gap: 20,
            boxShadow: "0 0 60px rgba(34,211,238,0.04)",
          }}
        >
          {[
            { name: "name",  Icon: FiUser, placeholder: "gigi",         type: "text"  },
            { name: "email", Icon: FiMail, placeholder: "you@example.com",   type: "email" },
          ].map(({ name, Icon, placeholder, type }) => (
            <div key={name}>
              <label style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#64748b", display: "block", marginBottom: 8, letterSpacing: "0.12em" }}>
                {name.toUpperCase()}
              </label>
              <div style={{ position: "relative" }}>
                <Icon size={14} color={focused === name ? "#22d3ee" : "#475569"} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", transition: "color 0.3s" }} />
                <input
                  name={name} value={form[name]} onChange={handleChange}
                  onFocus={() => setFocused(name)} onBlur={() => setFocused(null)}
                  placeholder={placeholder} type={type}
                  style={inputStyle(name)}
                />
              </div>
              {errors[name] && <p style={{ color: "#f87171", fontSize: 11, marginTop: 5 }}>{errors[name]}</p>}
            </div>
          ))}

          <div>
            <label style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#64748b", display: "block", marginBottom: 8, letterSpacing: "0.12em" }}>
              MESSAGE
            </label>
            <div style={{ position: "relative" }}>
              <FiMessageSquare size={14} color={focused === "message" ? "#22d3ee" : "#475569"} style={{ position: "absolute", left: 14, top: 14, transition: "color 0.3s" }} />
              <textarea
                name="message" value={form.message} onChange={handleChange}
                onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
                placeholder="Tell me about your project or opportunity..."
                rows={5}
                style={{ ...inputStyle("message"), paddingTop: 13, resize: "none" }}
              />
            </div>
            {errors.message && <p style={{ color: "#f87171", fontSize: 11, marginTop: 5 }}>{errors.message}</p>}
          </div>

          <motion.button
            type="submit" disabled={loading}
            whileHover={!loading ? { scale: 1.02, boxShadow: "0 0 40px rgba(34,211,238,0.4)" } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              padding: "14px 28px", borderRadius: 14, fontWeight: 600, fontSize: 14,
              fontFamily: "inherit", cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              background: "linear-gradient(135deg, #0e7490, #5b21b6)",
              border: "1px solid rgba(34,211,238,0.35)", color: "#fff",
              transition: "all 0.3s",
            }}
          >
            {loading
              ? <><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> Sending…</>
              : <><FiSend size={15} /> Send Message</>
            }
          </motion.button>
        </motion.form>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  )
}