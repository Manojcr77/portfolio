import { useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { FiGithub, FiExternalLink, FiCode } from "react-icons/fi"
import { fadeUp, staggerContainer } from "../animations/variants"
import API from "../utils/api"

const placeholders = [
  { _id: "p1", title: "Diabetic Retinopathy Detection", description: "Deep learning model using ResNet-50 to classify diabetic retinopathy severity from fundus images with 94% accuracy. Deployed as a REST API on AWS.", tech: "Python · TensorFlow · FastAPI · AWS", github: "https://github.com", live: "", image: "" },
  { _id: "p2", title: "AI Portfolio CMS", description: "Full-stack MERN portfolio with an admin CMS, JWT authentication, resume management, and a React Three Fiber animated background.", tech: "React · Node.js · MongoDB · Three.js", github: "https://github.com", live: "", image: "" },
  { _id: "p3", title: "Cloud Cost Optimizer", description: "ML-powered tool that analyses AWS CloudWatch metrics and recommends right-sizing actions, reducing monthly cloud spend by up to 35%.", tech: "Python · Scikit-learn · AWS · React", github: "https://github.com", live: "", image: "" },
]

function ProjectCard({ project, index }) {
  const navigate = useNavigate()   // ✅ ADDED

  const techList = project.tech?.split("·").map((t) => t.trim()) ?? []

  return (
    <motion.div
      onClick={() => {
        sessionStorage.setItem("scrollY", window.scrollY)
        navigate(`/project/${project._id}`)
      }}
      variants={fadeUp}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -8 }}
      className="glass rounded-2xl overflow-hidden border border-white/8 group flex flex-col"
      style={{ cursor: "pointer" }}
    >
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FiCode className="text-slate-600" size={40} />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-500/5" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />

        {/* 🔥 FIX: stop navigation when clicking buttons */}
        <div
          className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/70 hover:text-cyan-400 border border-white/10 transition"
            >
              <FiGithub size={14} />
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/70 hover:text-cyan-400 border border-white/10 transition"
            >
              <FiExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-white mb-2 text-base leading-snug">
          {project.title}
        </h3>

        <p className="text-slate-400 text-xs leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {techList.map((t) => (
            <span
              key={t}
              className="mono text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/8 border border-cyan-500/15 text-cyan-400/80"
            >
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
      .then((res) =>
        setProjects(
          Array.isArray(res.data) && res.data.length
            ? res.data
            : placeholders
        )
      )
      .catch(() => setProjects(placeholders))
  }, [])

  return (
    <section
      id="projects"
      className="relative px-6 md:px-16 py-16"
      ref={ref}
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="text-center mb-16"
      >
        <p className="section-tag mb-3">03 / projects</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold gradient-text">
          Things I've Built
        </h2>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
      >
        {projects.map((p, i) => (
          <ProjectCard key={p._id} project={p} index={i} />
        ))}
      </motion.div>
    </section>
  )
}
