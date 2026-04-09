/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body:    ["'DM Sans'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"]
      },
      colors: {
        navy:    "#020617",
        ink:     "#0a0f1e",
        cyan:    { DEFAULT: "#22d3ee", dim: "#0e7490" },
        violet:  { DEFAULT: "#a78bfa", dim: "#5b21b6" },
        neon:    "#39ff14"
      },
      animation: {
        "spin-slow":   "spin 12s linear infinite",
        "float":       "float 6s ease-in-out infinite",
        "pulse-slow":  "pulse 4s ease-in-out infinite",
        "grid-move":   "gridMove 20s linear infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-16px)" }
        },
        gridMove: {
          "0%":   { transform: "translateY(0)" },
          "100%": { transform: "translateY(-60px)" }
        }
      }
    }
  },
  plugins: []
}
