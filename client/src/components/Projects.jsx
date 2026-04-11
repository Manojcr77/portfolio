import { useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { FiGithub, FiExternalLink, FiCode, FiArrowRight } from "react-icons/fi"
import { fadeUp, staggerContainer } from "../animations/variants"
import API from "../utils/api"

const placeholders = [
  { _id: "p1", title: "Diabetic Retinopathy Detection", description: "Deep learning model using ResNet-50 to classify diabetic retinopathy severity from fundus images with 94% accuracy. Deployed as a REST API on AWS.", tech: "Python · TensorFlow · FastAPI · AWS", github: "https://github.com", live: "", image: "" },
  { _id: "p2", title: "AI Portfolio CMS", description: "Full-stack MERN portfolio with an admin CMS, JWT authentication, resume management, and a React Three Fiber animated background.", tech: "React · Node.js · MongoDB · Three.js", github: "https://github.com", live: "", image: "" },
  { _id: "p3", title: "Cloud Cost Optimizer", description: "ML-powered tool that analyses AWS CloudWatch metrics and recommends right-sizing actions, reducing monthly cloud spend by up to 35%.", tech: "Python · Scikit-learn · AWS · React", github: "https://github.com", live: "", image: "" },
]

function ProjectCard({ project, index }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const techList = project.tech?.split("·").map((t) => t.trim()) ?? []

  return (
    <motion.div
      onClick={() => {
        sessionStorage.setItem("scrollY", window.scrollY)
        navigate(`/project/${project._id}`)
      }}
      variants={fadeUp}
      transition={{ delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? "rgba(34,211,238,0.3)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 20, overflow: "hidden",
        cursor: "pointer", display: "flex", flexDirection: "column",
        transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
        transform: hovered ? "translateY(-10px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 24px 60px rgba(0,0,0,0.4), 0 0 40px rgba(34,211,238,0.1)"
          : "0 4px 20px rgba(0,0,0,0.2)",
      }}
    >
      {/* Image / Placeholder */}
      <div style={{
        position: "relative", height: 180, overflow: "hidden",
        background: "linear-gradient(135deg, #0d1117, #0a0f1e)",
      }}>
        {project.image ? (
          <img
            src={project.image} alt={project.title}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              transform: hovered ? "scale(1.08)" : "scale(1)",
              transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
          }}>
            {/* Animated gradient bg */}
            <div style={{
              position: "absolute", inset: 0,
              background: hovered
                ? "linear-gradient(135deg, rgba(34,211,238,0.12), rgba(167,139,250,0.12))"
                : "linear-gradient(135deg, rgba(34,211,238,0.04), rgba(167,139,250,0.04))",
              transition: "all 0.4s",
            }} />
            <FiCode size={44} color={hovered ? "rgba(34,211,238,0.5)" : "rgba(100,116,139,0.5)"} style={{ transition: "all 0.4s", position: "relative", zIndex: 1 }} />
            {/* Grid pattern */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              opacity: hovered ? 1 : 0, transition: "opacity 0.4s",
            }} />
          </div>
        )}
        {/* Top overlay gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(10,15,30,0.9) 0%, transparent 60%)",
        }} />
        {/* Hover action buttons */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute", top: 12, right: 12,
            display: "flex", gap: 8,
            opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(-8px)",
            transition: "all 0.3s",
          }}
        >
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer"
              style={{
                width: 34, height: 34, borderRadius: 10,
                background: "rgba(10,15,30,0.85)", backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(255,255,255,0.7)", transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#22d3ee"; e.currentTarget.style.borderColor = "rgba(34,211,238,0.4)" }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)" }}
            >
              <FiGithub size={14} />
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noreferrer"
              style={{
                width: 34, height: 34, borderRadius: 10,
                background: "rgba(10,15,30,0.85)", backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(255,255,255,0.7)", transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#22d3ee"; e.currentTarget.style.borderColor = "rgba(34,211,238,0.4)" }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)" }}
            >
              <FiExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
          <h3 style={{
            fontFamily: "Syne, sans-serif", fontWeight: 700, color: "#f1f5f9",
            fontSize: 15, lineHeight: 1.35, flex: 1,
          }}>
            {project.title}
          </h3>
          <motion.div
            animate={{ x: hovered ? 0 : -4, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ color: "#22d3ee", marginLeft: 8, flexShrink: 0, paddingTop: 2 }}
          >
            <FiArrowRight size={15} />
          </motion.div>
        </div>

        <p style={{
          color: "#64748b", fontSize: 12, lineHeight: 1.7,
          marginBottom: 16, flex: 1,
        }}>
          {project.description}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {techList.map((t) => (
            <span key={t} style={{
              fontFamily: "JetBrains Mono, monospace", fontSize: 10,
              padding: "4px 10px", borderRadius: 999,
              background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.15)",
              color: "rgba(34,211,238,0.75)", transition: "all 0.2s",
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  useEffect(() => {
    API.get("/projects")
      .then((res) => setProjects(Array.isArray(res.data) && res.data.length ? res.data : placeholders))
      .catch(() => setProjects(placeholders))
  }, [])

  return (
    <section id="projects" className="relative px-6 md:px-16 py-20" ref={ref}>
      <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} className="text-center mb-16">
        <p className="section-tag mb-3">03 / projects</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold gradient-text">Things I've Built</h2>
        <p style={{ color: "#64748b", fontSize: 14, marginTop: 12 }}>Click any card to explore the full project</p>
      </motion.div>

      <motion.div
        variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
      >
        {projects.map((p, i) => (
          <ProjectCard key={p._id} project={p} index={i} />
        ))}
      </motion.div>
    </section>
  )
}
