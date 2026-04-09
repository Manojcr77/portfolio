import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial, Float, MeshDistortMaterial } from "@react-three/drei"
import { useRef, useMemo, useState, useEffect } from "react"

function ParticleField() {
  const ref = useRef()
  const positions = useMemo(() => {
    const count = 4000
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) arr[i] = (Math.random() - 0.5) * 30
    return arr
  }, [])
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.02 })
  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial transparent color="#22d3ee" size={0.025} sizeAttenuation depthWrite={false} opacity={0.6} />
    </Points>
  )
}

function FloatingSphere({ position, color, speed = 1, distort = 0.4, scale = 1 }) {
  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial color={color} distort={distort} speed={2} transparent opacity={0.12} />
      </mesh>
    </Float>
  )
}

function TorusKnot() {
  const ref = useRef()
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.08
      ref.current.rotation.y += delta * 0.12
    }
  })
  return (
    <mesh ref={ref} position={[4, -1, -5]} scale={1.2}>
      <torusKnotGeometry args={[1, 0.28, 100, 16]} />
      <meshStandardMaterial color="#a78bfa" wireframe transparent opacity={0.15} />
    </mesh>
  )
}

function OrbitingCubes() {
  const group = useRef()
  useFrame(({ clock }) => { if (group.current) group.current.rotation.y = clock.getElapsedTime() * 0.15 })
  const cubes = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => {
      const angle = (i / 5) * Math.PI * 2
      return { x: Math.cos(angle) * 7, z: Math.sin(angle) * 7, size: 0.18 + Math.random() * 0.14 }
    }), [])
  return (
    <group ref={group} position={[0, 0, -6]}>
      {cubes.map((c, i) => (
        <mesh key={i} position={[c.x, 0, c.z]}>
          <boxGeometry args={[c.size, c.size, c.size]} />
          <meshStandardMaterial color="#22d3ee" transparent opacity={0.25} wireframe />
        </mesh>
      ))}
    </group>
  )
}

export default function ThreeBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 60 }}
      style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: -3, pointerEvents: "none" }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} color="#22d3ee" intensity={0.8} />
      <pointLight position={[-10, -5, 5]} color="#a78bfa" intensity={0.6} />
      <ParticleField />
      <TorusKnot />
      <OrbitingCubes />
      <FloatingSphere position={[-6, 3, -4]}  color="#22d3ee" speed={0.8} distort={0.5} scale={1.8} />
      <FloatingSphere position={[6, -2, -6]}  color="#a78bfa" speed={1.2} distort={0.3} scale={2.2} />
      <FloatingSphere position={[0, -4, -3]}  color="#39ff14" speed={0.6} distort={0.6} scale={0.9} />
    </Canvas>
  )
}