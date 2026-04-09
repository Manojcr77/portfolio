import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import toast from "react-hot-toast"
import { FiSend, FiUser, FiMail, FiMessageSquare } from "react-icons/fi"
import { fadeUp, fadeLeft, fadeRight } from "../animations/variants"
import API from "../utils/api"

export default function Contact() {
  const [form, setForm]     = useState({ name: "", email: "", message: "" })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
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

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setErrors({ ...errors, [e.target.name]: "" }) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await API.post("/contact", form)
      toast.success("Message sent!")
      setForm({ name: "", email: "", message: "" })
    } catch { toast.error("Failed to send. Try again.") }
    finally { setLoading(false) }
  }

 const inputClass = (field) =>
  `w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:bg-white/5 focus:border-cyan-500/60 ${errors[field] ? "border-red-500/60" : "border-white/8 hover:border-white/15"}`

  return (
    <section id="contact" className="relative min-h-screen px-6 md:px-16 py-28" ref={ref}>
      <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} className="text-center mb-16">
        <p className="section-tag mb-3">04 / contact</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold gradient-text">Let&apos;s Work Together</h2>
      </motion.div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        <motion.div variants={fadeLeft} initial="hidden" animate={inView ? "visible" : "hidden"} className="flex flex-col gap-6">
          <div className="glass rounded-2xl p-6 border border-white/8">
            <h3 className="font-display font-semibold text-white mb-2">Based in India</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Open to remote roles, internships, and full-time AI/ML or full-stack positions.</p>
          </div>
          
        </motion.div>

        <motion.form variants={fadeRight} initial="hidden" animate={inView ? "visible" : "hidden"} onSubmit={handleSubmit}
          className="glass rounded-2xl p-8 border border-white/8 flex flex-col gap-5" noValidate>
          {[
            { name: "name",    Icon: FiUser,          placeholder: "gigi",           type: "text"  },
            { name: "email",   Icon: FiMail,          placeholder: "you@example.com",     type: "email" },
          ].map(({ name, Icon, placeholder, type }) => (
            <div key={name}>
              <label className="mono text-xs text-slate-500 mb-1.5 block tracking-wider">{name.toUpperCase()}</label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                <input name={name} value={form[name]} onChange={handleChange} placeholder={placeholder} type={type} className={`${inputClass(name)} pl-9`} />
              </div>
              {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
            </div>
          ))}
          <div>
            <label className="mono text-xs text-slate-500 mb-1.5 block tracking-wider">MESSAGE</label>
            <div className="relative">
              <FiMessageSquare className="absolute left-3 top-3.5 text-slate-600" size={14} />
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell me about your project..." rows={5} className={`${inputClass("message")} pl-9 resize-none`} />
            </div>
            {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
          </div>
          <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSend size={14} />}
            {loading ? "Sending…" : "Send Message"}
          </button>
        </motion.form>
      </div>
    </section>
  )
}