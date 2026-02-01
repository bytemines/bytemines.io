"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  baseRadius: number
  color: string
  iconIndex: number
  scale: number
}

// Pantone-inspired rainbow spectrum (balanced visual weight)
// Based on Pantone Matching System standards
const PARTICLE_COLORS = [
  "#E4002B", // Pantone Red (185 C) - pure red
  "#FF6F00", // Pantone Orange (021 C) - vibrant orange
  "#FFD100", // Pantone Yellow (116 C) - golden yellow
  "#00A651", // Pantone Green (354 C) - true green
  "#00B4D8", // Pantone Cyan (3125 C) - sky blue
  "#0057B8", // Pantone Blue (300 C) - royal blue
  "#6B3FA0", // Pantone Violet (2685 C) - purple
  "#E91E8C", // Pantone Magenta (806 C) - hot pink (closes the wheel)
]

// Lucide icon SVG paths (24x24 viewBox)
// Themes: Biotech, Quantum, AI, Science, Mining
const ICON_PATHS: { name: string; path: string }[] = [
  // Biotech
  { name: "dna", path: "M2 15c6.667-6 13.333 0 20-6M9 22c1.798-1.998 2.518-3.995 2.807-5.993M15 2c-1.798 1.998-2.518 3.995-2.807 5.993M2 9c6.667 6 13.333 0 20 6M9.1 14.4a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8ZM14.9 7.8a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8Z" },
  { name: "flask", path: "M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2M8.5 2h7M7 16h10" },
  { name: "microscope", path: "M6 18h8M3 22h18M14 22a7 7 0 1 0 0-14h-1M9 14h2M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2ZM12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" },
  { name: "heart-pulse", path: "M19.5 12.572l-7.5 7.428l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572M12 6l-1 4h2l-1 4" },
  // Quantum
  { name: "atom", path: "M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0M12 3c-2.21 0-4 4.03-4 9s1.79 9 4 9s4-4.03 4-9s-1.79-9-4-9" },
  { name: "orbit", path: "M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0M3 12c0 2.761 4.03 5 9 5s9-2.239 9-5s-4.03-5-9-5s-9 2.239-9 5M12 3c-2.761 0-5 4.03-5 9s2.239 9 5 9s5-4.03 5-9s-2.239-9-5-9" },
  { name: "sparkles", path: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0zM20 3v4M22 5h-4M4 17v2M5 18H3" },
  { name: "zap", path: "M13 2L3 14h9l-1 8l10-12h-9l1-8z" },
  // AI
  { name: "brain", path: "M12 5a3 3 0 1 0-5.997.125a4 4 0 0 0-2.526 5.77a4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18ZM12 5a3 3 0 1 1 5.997.125a4 4 0 0 1 2.526 5.77a4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18ZM12 5v13M9 13h6" },
  { name: "cpu", path: "M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2M6 6h12v12H6zM9 9h6v6H9z" },
  { name: "bot", path: "M12 8V4H8M8 4H6a2 2 0 0 0-2 2v1M8 4h8M16 4h2a2 2 0 0 1 2 2v1M2 9h2M20 9h2M6 13v-1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1M6 13h12a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2ZM9 17v.01M15 17v.01" },
  { name: "binary", path: "M10 4H6v6h4V4ZM14 10h4v6h-4v-6ZM10 14v6M6 14v6M14 4v6M18 4v6" },
  // Science
  { name: "beaker", path: "M4.5 3h15M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3M6 14h12" },
  { name: "lightbulb", path: "M15 14c.2-1 .7-1.7 1.5-2.5c1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5c.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4" },
  { name: "telescope", path: "m10.065 12.493l-6.18 1.318a.934.934 0 0 1-1.108-.702l-.537-2.15a1.07 1.07 0 0 1 .691-1.265l13.504-4.44M13 20l-2-8M16.5 20l-2.5-8M21 4l-3 11.5M2 21l6-6" },
  // Mining
  { name: "pickaxe", path: "M14.531 12.469L6.619 20.38a1 1 0 0 1-1.414-1.414l7.912-7.912M15.686 4.314A2 2 0 0 0 14.272 2H14a2 2 0 0 0-2 2v.28a2 2 0 0 0 .586 1.414l8 8A2 2 0 0 0 22 13.272V13a2 2 0 0 0-2-2h-.28a2 2 0 0 1-1.414-.586l-2.62-2.62Z" },
  { name: "gem", path: "M6 3h12l4 6l-10 13L2 9ZM11 3l1 10l-4-7M13 3l-1 10l4-7M2 9h20" },
  { name: "mountain", path: "m8 3l4 8l5-5l5 15H2L8 3z" },
  { name: "layers", path: "M12 2L2 7l10 5l10-5l-10-5ZM2 17l10 5l10-5M2 12l10 5l10-5" },
  // Extra science/tech
  { name: "circuit", path: "M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M2 12h8M14 12h8M12 2v8M12 14v8" },
  { name: "radar", path: "M19.07 4.93A10 10 0 0 0 6.99 3.34M4.93 19.07A10 10 0 0 1 3.34 6.99M16.24 7.76a6 6 0 0 1 .5 7.74M7.76 16.24a6 6 0 0 1-.5-7.74M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0" },
]

export function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const iconsRef = useRef<HTMLCanvasElement[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight

    const resize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    document.body.addEventListener("mouseleave", handleMouseLeave)

    // Pre-render icons to offscreen canvases
    const iconSize = 48
    iconsRef.current = ICON_PATHS.map((icon) => {
      const offscreen = document.createElement("canvas")
      offscreen.width = iconSize
      offscreen.height = iconSize
      const offCtx = offscreen.getContext("2d")
      if (offCtx) {
        offCtx.scale(iconSize / 24, iconSize / 24)
        offCtx.strokeStyle = "#ffffff"
        offCtx.lineWidth = 1.5
        offCtx.lineCap = "round"
        offCtx.lineJoin = "round"
        const path = new Path2D(icon.path)
        offCtx.stroke(path)
      }
      return offscreen
    })

    // Initialize particles
    const particles: Particle[] = []
    const numParticles = 50

    for (let i = 0; i < numParticles; i++) {
      const baseRadius = Math.random() * 4 + 3
      let x: number, y: number
      let valid = false
      let attempts = 0

      while (!valid && attempts < 100) {
        x = baseRadius * 3 + Math.random() * (width - baseRadius * 6)
        y = baseRadius * 3 + Math.random() * (height - baseRadius * 6)
        valid = true

        for (const p of particles) {
          const dx = x - p.x
          const dy = y - p.y
          if (dx * dx + dy * dy < (baseRadius + p.baseRadius + 10) ** 2) {
            valid = false
            break
          }
        }
        attempts++
      }

      if (valid) {
        const speed = 0.3 + Math.random() * 0.7
        const angle = Math.random() * Math.PI * 2
        particles.push({
          x: x!,
          y: y!,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          baseRadius,
          color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
          iconIndex: Math.floor(Math.random() * ICON_PATHS.length),
          scale: 1,
        })
      }
    }

    let animationId: number
    const hoverRadius = 60
    const maxScale = 2.5
    const scaleSpeed = 0.12

    const animate = () => {
      const mouse = mouseRef.current
      ctx.clearRect(0, 0, width, height)

      // 1. Update scales
      for (const p of particles) {
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const distSq = dx * dx + dy * dy
        const targetScale = distSq < hoverRadius * hoverRadius ? maxScale : 1
        p.scale += (targetScale - p.scale) * scaleSpeed
      }

      // 2. Update positions
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
      }

      // 3. Wall collisions
      for (const p of particles) {
        const r = p.baseRadius * p.scale
        if (p.x < r) { p.x = r; if (p.vx < 0) p.vx = -p.vx * 0.8 }
        if (p.x > width - r) { p.x = width - r; if (p.vx > 0) p.vx = -p.vx * 0.8 }
        if (p.y < r) { p.y = r; if (p.vy < 0) p.vy = -p.vy * 0.8 }
        if (p.y > height - r) { p.y = height - r; if (p.vy > 0) p.vy = -p.vy * 0.8 }
      }

      // 4. Particle collisions
      for (let iter = 0; iter < 3; iter++) {
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i]
          const r1 = p1.baseRadius * p1.scale

          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j]
            const r2 = p2.baseRadius * p2.scale

            const dx = p2.x - p1.x
            const dy = p2.y - p1.y
            const distSq = dx * dx + dy * dy
            const minDist = r1 + r2

            if (distSq >= minDist * minDist || distSq < 0.001) continue

            const dist = Math.sqrt(distSq)
            const overlap = minDist - dist
            const nx = dx / dist
            const ny = dy / dist

            const m1 = r1 * r1
            const m2 = r2 * r2
            const totalMass = m1 + m2

            const sep1 = overlap * (m2 / totalMass)
            const sep2 = overlap * (m1 / totalMass)

            p1.x -= nx * sep1
            p1.y -= ny * sep1
            p2.x += nx * sep2
            p2.y += ny * sep2

            if (iter === 0) {
              const dvn = (p1.vx - p2.vx) * nx + (p1.vy - p2.vy) * ny
              if (dvn > 0) {
                const impulse = 1.9 * dvn / totalMass
                p1.vx -= impulse * m2 * nx
                p1.vy -= impulse * m2 * ny
                p2.vx += impulse * m1 * nx
                p2.vy += impulse * m1 * ny
              }
            }
          }
        }

        for (const p of particles) {
          const r = p.baseRadius * p.scale
          if (p.x < r) p.x = r
          if (p.x > width - r) p.x = width - r
          if (p.y < r) p.y = r
          if (p.y > height - r) p.y = height - r
        }
      }

      // 5. Random drift
      for (const p of particles) {
        p.vx += (Math.random() - 0.5) * 0.02
        p.vy += (Math.random() - 0.5) * 0.02
      }

      // 6. Draw
      for (const p of particles) {
        const r = p.baseRadius * p.scale
        const isExpanded = p.scale > 1.2

        ctx.fillStyle = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur = isExpanded ? 25 : 12
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fill()

        // Draw icon when expanded (transparent/cut-out effect)
        if (p.scale > 1.5 && iconsRef.current[p.iconIndex]) {
          ctx.shadowBlur = 0
          ctx.globalCompositeOperation = "destination-out"
          const iconCanvas = iconsRef.current[p.iconIndex]
          const iconSize = r * 1.4
          ctx.drawImage(
            iconCanvas,
            p.x - iconSize / 2,
            p.y - iconSize / 2,
            iconSize,
            iconSize
          )
          ctx.globalCompositeOperation = "source-over"
        }
      }

      ctx.shadowBlur = 0
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      document.body.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  )
}
