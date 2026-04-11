import { useState, useEffect } from "react"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const links = ["About", "Skills", "Projects", "Contact"]

  const handleNav = (section) => {
    const el = document.getElementById(section.toLowerCase())
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <nav
      className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#020617]/90 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo — always visible */}
        <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Manoj.CR
        </span>

        {/* Desktop links — hidden on mobile */}
        <ul className="flex items-center gap-8">
          {links.map((link) => (
            <li key={link}>
              <button
                onClick={() => handleNav(link)}
                className="text-sm text-gray-300 hover:text-cyan-400 transition-colors duration-200"
              >
                {link}
              </button>
            </li>
          ))}
        </ul>

      </div>
    </nav>
  )
}