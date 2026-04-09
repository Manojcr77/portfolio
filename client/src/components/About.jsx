import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { FiUser, FiBookOpen, FiTarget, FiCpu } from "react-icons/fi"
import API from "../utils/api"
import { fadeUp, fadeLeft, staggerContainer } from "../animations/variants"

const cards = [
  { icon: FiUser,     title: "Who I Am",     text: "A passionate 4th-year AIML Engineering student who loves bridging the gap between research and real-world software." },
  { icon: FiBookOpen, title: "Education",    text: "B.E. in Artificial Intelligence & Machine Learning — Final Year. Strong foundation in algorithms, neural networks, and data science." },
  { icon: FiCpu,      title: "What I Build", text: "End-to-end AI/ML pipelines, scalable MERN applications, and cloud-native architectures on AWS, GCP, and Azure." },
  { icon: FiTarget,   title: "Career Goal",  text: "To work on cutting-edge AI products that solve real human problems, combining ML research with production-grade software engineering." },
]

export default function About() {
  const [description, setDescription] = useState("")
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    API.get("/about").then((res) => { if (res.data?.description) setDescription(res.data.description) }).catch(() => {})
  }, [])

  return (
    <section id="about" className="relative px-6 md:px-16 py-16" ref={ref} aria-label="About Manoj C R">
      <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} className="text-center mb-16">
        <p className="section-tag mb-3">01 / about me</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold gradient-text">The Engineer Behind the Code</h2>
      </motion.div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        <motion.div variants={fadeLeft} initial="hidden" animate={inView ? "visible" : "hidden"} className="flex flex-col items-center md:items-start gap-8">
          <div className="relative w-52 h-52 rounded-3xl overflow-hidden border-gradient">
            <div className="w-full h-full glass-strong flex items-center justify-center">
              <div className="text-7xl select-none">🧑🏿‍💻</div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-violet-500" />
          </div>

          <div className="glass rounded-2xl p-6 border border-white/8 max-w-md">
            <p className="text-slate-300 leading-relaxed text-sm">
              {description || <>Hi, I&apos;m <span className="text-cyan-400 font-semibold">Manoj C R</span> — an <span className="text-violet-400">AI/ML Engineer</span> and full-stack developer based in India. He specializes in building intelligent, scalable systems using modern web technologies and machine learning frameworks.</>}
            </p>
          </div>

          
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map(({ icon: Icon, title, text }) => (
            <motion.div key={title} variants={fadeUp} className="glass rounded-2xl p-5 border border-white/8 card-hover group">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition">
                <Icon className="text-cyan-400" size={18} />
              </div>
              <h3 className="font-display font-semibold text-white mb-2 text-sm">{title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}