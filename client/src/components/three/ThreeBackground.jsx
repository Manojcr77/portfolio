import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial, Float, MeshDistortMaterial } from "@react-three/drei"
import { useRef, useMemo, useState, useEffect } from "react"
import * as THREE from "three"

function ParticleField() {
  const ref = useRef()
  const positions = useMemo(() => {
    const count = 7000
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) arr[i] = (Math.random() - 0.5) * 40
    return arr
  }, [])
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.04
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.02) * 0.1
    }
  })
  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial transparent color="#22d3ee" size={0.03} sizeAttenuation depthWrite={false} opacity={0.7} />
    </Points>
  )
}

function NeonRing({ radius, color, speed, tiltX = 0, tiltZ = 0 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * speed
  })
  const geo = useMemo(() => {
    const points = []
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2
      points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.3, Math.sin(angle) * radius))
    }
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [radius])
  return (
    <line ref={ref} geometry={geo} rotation={[tiltX, 0, tiltZ]}>
      <lineBasicMaterial color={color} transparent opacity={0.18} />
    </line>
  )
}

function FloatingSphere({ position, color, speed = 1, distort = 0.4, scale = 1 }) {
  return (
    <Float speed={speed} rotationIntensity={0.8} floatIntensity={2.5}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial color={color} distort={distort} speed={3} transparent opacity={0.14} />
      </mesh>
    </Float>
  )
}

function TorusKnot() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.getElapsedTime() * 0.10
      ref.current.rotation.y = clock.getElapsedTime() * 0.15
      ref.current.rotation.z = clock.getElapsedTime() * 0.05
    }
  })
  return (
    <mesh ref={ref} position={[4, -1, -5]} scale={1.4}>
      <torusKnotGeometry args={[1, 0.3, 128, 20]} />
      <meshStandardMaterial color="#a78bfa" wireframe transparent opacity={0.18} />
    </mesh>
  )
}

function OrbitingCubes() {
  const group = useRef()
  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = clock.getElapsedTime() * 0.25
  })
  const cubes = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2
      return {
        x: Math.cos(angle) * 8,
        z: Math.sin(angle) * 8,
        y: Math.sin(angle * 2) * 1.5,
        size: 0.15 + Math.random() * 0.2,
        color: i % 2 === 0 ? "#22d3ee" : "#a78bfa",
      }
    }), [])
  return (
    <group ref={group} position={[0, 0, -6]}>
      {cubes.map((c, i) => (
        <mesh key={i} position={[c.x, c.y, c.z]}>
          <boxGeometry args={[c.size, c.size, c.size]} />
          <meshStandardMaterial color={c.color} transparent opacity={0.3} wireframe />
        </mesh>
      ))}
    </group>
  )
}

function PulsingGrid() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.material.opacity = 0.04 + Math.sin(clock.getElapsedTime() * 0.8) * 0.02
    }
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -7, 0]}>
      <planeGeometry args={[60, 60, 30, 30]} />
      <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.05} />
    </mesh>
  )
}

function ShootingStar() {
  const ref = useRef()
  const startX = useMemo(() => (Math.random() - 0.5) * 30, [])
  const startY = useMemo(() => 6 + Math.random() * 4, [])
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = (clock.getElapsedTime() * 0.4) % 1
      ref.current.position.x = startX - t * 20
      ref.current.position.y = startY - t * 12
      ref.current.position.z = -8
      ref.current.material.opacity = t < 0.1 ? t * 10 : t > 0.8 ? (1 - t) * 5 : 0.7
    }
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
    </mesh>
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
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]}  color="#22d3ee" intensity={1.2} />
      <pointLight position={[-10, -5, 5]}  color="#a78bfa" intensity={0.9} />
      <pointLight position={[0, 8, -8]}    color="#39ff14" intensity={0.4} />

      <ParticleField />
      <TorusKnot />
      <OrbitingCubes />
      <PulsingGrid />
      <ShootingStar />

      <NeonRing radius={12} color="#22d3ee" speed={0.12}  tiltX={0.4} />
      <NeonRing radius={9}  color="#a78bfa" speed={-0.09} tiltX={-0.3} tiltZ={0.2} />
      <NeonRing radius={15} color="#39ff14" speed={0.06}  tiltX={0.6}  tiltZ={0.4} />

      <FloatingSphere position={[-6, 3,  -4]} color="#22d3ee" speed={1.0} distort={0.6} scale={2.2} />
      <FloatingSphere position={[6, -2,  -6]} color="#a78bfa" speed={1.5} distort={0.4} scale={2.6} />
      <FloatingSphere position={[0, -4,  -3]} color="#39ff14" speed={0.8} distort={0.7} scale={1.1} />
      <FloatingSphere position={[-3, 5,  -8]} color="#f472b6" speed={0.6} distort={0.5} scale={1.4} />
    </Canvas>
  )
}