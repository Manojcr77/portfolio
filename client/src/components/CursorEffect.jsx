import { useEffect, useRef } from "react"

export default function CursorEffect() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0, mouseY = 0
    let ringX  = 0, ringY  = 0
    let raf

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.left = mouseX + "px"
      dot.style.top  = mouseY + "px"
    }

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.left = ringX + "px"
      ring.style.top  = ringY + "px"
      raf = requestAnimationFrame(animate)
    }

    // Hide on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return

    window.addEventListener("mousemove", onMove)
    raf = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div id="cursor-dot"  ref={dotRef}  />
      <div id="cursor-ring" ref={ringRef} />
    </>
  )
}
