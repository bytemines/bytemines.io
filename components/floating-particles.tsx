"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  mass: number
}

export function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // Initialize particles without overlap
    const particles: Particle[] = []
    const numParticles = 150

    for (let i = 0; i < numParticles; i++) {
      const radius = Math.random() * 4 + 3
      let x: number, y: number
      let valid = false
      let attempts = 0

      while (!valid && attempts < 100) {
        x = radius + Math.random() * (canvas.width - radius * 2)
        y = radius + Math.random() * (canvas.height - radius * 2)
        valid = true

        for (const p of particles) {
          const dx = x - p.x
          const dy = y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < radius + p.radius + 5) {
            valid = false
            break
          }
        }
        attempts++
      }

      if (valid) {
        particles.push({
          x: x!,
          y: y!,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          radius,
          mass: radius * radius,
        })
      }
    }

    let animationId: number

    const animate = () => {
      const width = canvas.width
      const height = canvas.height

      ctx.clearRect(0, 0, width, height)

      // Update positions
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
      }

      // Wall collisions
      for (const p of particles) {
        if (p.x <= p.radius) {
          p.x = p.radius
          p.vx = Math.abs(p.vx)
        } else if (p.x >= width - p.radius) {
          p.x = width - p.radius
          p.vx = -Math.abs(p.vx)
        }

        if (p.y <= p.radius) {
          p.y = p.radius
          p.vy = Math.abs(p.vy)
        } else if (p.y >= height - p.radius) {
          p.y = height - p.radius
          p.vy = -Math.abs(p.vy)
        }
      }

      // Particle-particle collisions
      // Based on: https://ericleong.me/research/circle-circle/
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i]
          const p2 = particles[j]

          // Vector from p1 to p2
          const dx = p2.x - p1.x
          const dy = p2.y - p1.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const minDist = p1.radius + p2.radius

          // Check if circles are overlapping
          if (dist < minDist && dist > 0.0001) {
            // Unit normal vector (from p1 to p2)
            const nx = dx / dist
            const ny = dy / dist

            // Unit tangent vector (perpendicular to normal)
            const tx = -ny
            const ty = nx

            // Project velocities onto normal and tangent
            const v1n = p1.vx * nx + p1.vy * ny
            const v1t = p1.vx * tx + p1.vy * ty
            const v2n = p2.vx * nx + p2.vy * ny
            const v2t = p2.vx * tx + p2.vy * ty

            // Only collide if particles are approaching
            if (v1n - v2n > 0) {
              // Elastic collision formula for normal components
              // Tangent components remain unchanged
              const m1 = p1.mass
              const m2 = p2.mass
              const newV1n = (v1n * (m1 - m2) + 2 * m2 * v2n) / (m1 + m2)
              const newV2n = (v2n * (m2 - m1) + 2 * m1 * v1n) / (m1 + m2)

              // Convert back to x,y velocities
              p1.vx = newV1n * nx + v1t * tx
              p1.vy = newV1n * ny + v1t * ty
              p2.vx = newV2n * nx + v2t * tx
              p2.vy = newV2n * ny + v2t * ty
            }

            // Separate particles so they touch exactly at their edges
            const overlap = minDist - dist
            const separationRatio1 = p2.mass / (p1.mass + p2.mass)
            const separationRatio2 = p1.mass / (p1.mass + p2.mass)

            p1.x -= overlap * separationRatio1 * nx
            p1.y -= overlap * separationRatio1 * ny
            p2.x += overlap * separationRatio2 * nx
            p2.y += overlap * separationRatio2 * ny
          }
        }
      }

      // Small drift
      for (const p of particles) {
        p.vx += (Math.random() - 0.5) * 0.008
        p.vy += (Math.random() - 0.5) * 0.008
      }

      // Draw
      ctx.fillStyle = "#ff3333"
      ctx.shadowColor = "#ff3333"
      ctx.shadowBlur = 12

      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.shadowBlur = 0
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resize)
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
