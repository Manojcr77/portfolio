import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Suspense, lazy } from "react"
import { Toaster } from "react-hot-toast"

import Navbar         from "./components/Navbar"
import Hero           from "./components/Hero"
import About          from "./components/About"
import Skills         from "./components/Skills"
import Projects       from "./components/Projects"
import Contact        from "./components/Contact"
import Footer         from "./components/Footer"
import FloatingNav    from "./components/FloatingNav"
import CursorEffect   from "./components/CursorEffect"
import ScrollProgress from "./components/ScrollProgress"

const Admin          = lazy(() => import("./pages/Admin.jsx"))
const ProjectDetails = lazy(() => import("./pages/ProjectDetails.jsx"))

function HomePage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <div className="grid-bg" />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
      <FloatingNav />
    </>
  )
}

export default function App() {
  return (
    <Router>
      {/* CursorEffect is global — works on ALL pages including /project/:id */}
      <CursorEffect />

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0d1117",
            color: "#e2e8f0",
            border: "1px solid rgba(34,211,238,0.2)",
            borderRadius: 12,
            fontFamily: "DM Sans, sans-serif",
            fontSize: 13,
          },
          success: { iconTheme: { primary: "#22d3ee", secondary: "#0d1117" } },
          error:   { iconTheme: { primary: "#f87171", secondary: "#0d1117" } },
        }}
      />

      <Suspense
        fallback={
          <div style={{
            minHeight: "100vh", display: "flex", alignItems: "center",
            justifyContent: "center", background: "#020617",
            flexDirection: "column", gap: 16,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              border: "3px solid rgba(34,211,238,0.15)",
              borderTopColor: "#22d3ee",
              animation: "spin 0.7s linear infinite",
            }} />
            <span style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 11, color: "#334155", letterSpacing: "0.2em",
            }}>
              LOADING
            </span>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        }
      >
        <Routes>
          <Route path="/"            element={<HomePage />} />
          <Route path="/admin"       element={<Admin />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
        </Routes>
      </Suspense>
    </Router>
  )
}