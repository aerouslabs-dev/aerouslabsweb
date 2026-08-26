import { useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'

export function TiltCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('rotateX(0deg) rotateY(0deg)')
  const [glow, setGlow] = useState({ x: 50, y: 50, opacity: 0 })

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const rotateY = (px - 0.5) * 10
    const rotateX = (0.5 - py) * 10
    setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`)
    setGlow({ x: px * 100, y: py * 100, opacity: 1 })
  }

  const handleLeave = () => {
    setTransform('rotateX(0deg) rotateY(0deg)')
    setGlow((g) => ({ ...g, opacity: 0 }))
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transform, transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)', transformStyle: 'preserve-3d' }}
      whileHover={{ y: -4 }}
      className={`glass-card relative overflow-hidden rounded-2xl ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
        style={{
          opacity: glow.opacity * 0.5,
          background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(0,242,254,0.15), transparent 60%)`,
        }}
      />
      {children}
    </motion.div>
  )
}
