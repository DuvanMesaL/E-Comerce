"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  baseSize: number
  speedX: number
  speedY: number
  color: string
  alpha: number
  hue: number
  colorMode: "fixed" | "dynamic"
  life: number
  maxLife: number
}

export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const mousePosition = useRef({ x: 0, y: 0 })
  const lastMousePosition = useRef({ x: 0, y: 0 })
  const mouseSpeed = useRef(0)
  const mouseActive = useRef(false)
  const animationFrameId = useRef<number>(0)
  const hueRotation = useRef(0)
  const frameCount = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Calcular la velocidad del mouse
      const dx = e.clientX - lastMousePosition.current.x
      const dy = e.clientY - lastMousePosition.current.y
      mouseSpeed.current = Math.sqrt(dx * dx + dy * dy)

      lastMousePosition.current = { x: e.clientX, y: e.clientY }
      mousePosition.current = { x: e.clientX, y: e.clientY }
      mouseActive.current = true

      // Crear partículas basadas en la velocidad del mouse, pero con menos frecuencia
      frameCount.current++
      if (frameCount.current % 3 === 0 && mouseSpeed.current > 8) {
        // Aumentar el umbral y reducir frecuencia
        // Reducir la cantidad de partículas creadas
        const particlesToCreate = Math.min(Math.floor(mouseSpeed.current / 10), 2) // Menos partículas
        for (let i = 0; i < particlesToCreate; i++) {
          if (particles.current.length < 150) {
            // Limitar el máximo de partículas
            createMouseParticle()
          }
        }
      }
    }

    const handleMouseLeave = () => {
      mouseActive.current = false
    }

    const handleMouseEnter = () => {
      mouseActive.current = true
    }

    const getRandomColor = (dynamic = false): { color: string; hue: number } => {
      const hue = Math.floor(Math.random() * 60) + 260 // Rango de púrpuras y azules
      return {
        color: `hsl(${hue}, 80%, 60%)`,
        hue: hue,
      }
    }

    const createParticle = (
      x?: number,
      y?: number,
      size?: number,
      speedX?: number,
      speedY?: number,
      dynamic = false,
    ): Particle => {
      const { color, hue } = getRandomColor(dynamic)
      const actualSize = size || Math.random() * 2 + 1
      return {
        x: x !== undefined ? x : Math.random() * canvas.width,
        y: y !== undefined ? y : Math.random() * canvas.height,
        size: actualSize,
        baseSize: actualSize,
        speedX: speedX !== undefined ? speedX : (Math.random() - 0.5) * 0.5,
        speedY: speedY !== undefined ? speedY : (Math.random() - 0.5) * 0.5,
        color: color,
        alpha: Math.random() * 0.5 + 0.3,
        hue: hue,
        colorMode: dynamic ? "dynamic" : "fixed",
        life: 0,
        // Reducir la vida de las partículas dinámicas para que desaparezcan más rápido
        maxLife: dynamic ? 30 + Math.random() * 20 : 200 + Math.random() * 100,
      }
    }

    const createMouseParticle = () => {
      const angle = Math.random() * Math.PI * 2
      // Reducir la velocidad de las partículas del mouse
      const speed = mouseSpeed.current * 0.05 * (Math.random() * 0.5 + 0.3)
      // Reducir el tamaño de las partículas del mouse
      const size = Math.random() * 2 + 1

      particles.current.push(
        createParticle(
          mousePosition.current.x,
          mousePosition.current.y,
          size,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          true,
        ),
      )
    }

    const initParticles = () => {
      particles.current = []
      const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 10000), 100)

      for (let i = 0; i < particleCount; i++) {
        particles.current.push(createParticle())
      }
    }

    const animate = () => {
      // Actualizar rotación de color
      hueRotation.current = (hueRotation.current + 0.3) % 360

      // Limpiar con un fondo semi-transparente para un efecto de rastro
      ctx.fillStyle = "rgba(10, 1, 24, 0.3)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Actualizar y dibujar partículas
      particles.current.forEach((particle, index) => {
        // Actualizar posición
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Actualizar vida
        particle.life++

        // Actualizar color para partículas dinámicas, pero más lentamente
        if (particle.colorMode === "dynamic" && particle.life % 2 === 0) {
          particle.hue = (particle.hue + 0.5) % 360
          particle.color = `hsl(${particle.hue}, 80%, 60%)`
        }

        // Interacción con el mouse, pero más suave
        if (mouseActive.current) {
          const dx = mousePosition.current.x - particle.x
          const dy = mousePosition.current.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDistance = 150

          if (distance < maxDistance) {
            // Reducir la fuerza de atracción/repulsión
            const force = (1 - distance / maxDistance) * 0.1 // Reducido de 0.2 a 0.1
            const angle = Math.atan2(dy, dx)

            // Alternar entre atracción y repulsión basado en la distancia, pero más suave
            const attractFactor = distance < 50 ? -0.5 : 0.5 // Reducido de -1/1 a -0.5/0.5

            particle.speedX += Math.cos(angle) * force * attractFactor
            particle.speedY += Math.sin(angle) * force * attractFactor

            // Cambiar tamaño cuando está cerca del mouse, pero menos
            particle.size = particle.baseSize * (1 + (1 - distance / maxDistance) * 1.5) // Reducido de 2 a 1.5

            // Aumentar brillo cerca del mouse, pero menos
            particle.alpha = Math.min(0.8, particle.alpha + 0.03) // Reducido de 1.0/0.05 a 0.8/0.03
          } else {
            // Volver gradualmente al tamaño normal
            particle.size = particle.size * 0.95 + particle.baseSize * 0.05

            // Volver gradualmente a la opacidad normal
            particle.alpha = particle.alpha * 0.95 + 0.5 * 0.05
          }
        }

        // Comprobar límites con efecto rebote
        if (particle.x < 0) {
          particle.x = 0
          particle.speedX *= -0.5
        } else if (particle.x > canvas.width) {
          particle.x = canvas.width
          particle.speedX *= -0.5
        }

        if (particle.y < 0) {
          particle.y = 0
          particle.speedY *= -0.5
        } else if (particle.y > canvas.height) {
          particle.y = canvas.height
          particle.speedY *= -0.5
        }

        // Aplicar fricción
        particle.speedX *= 0.98
        particle.speedY *= 0.98

        // Dibujar la partícula con efecto de brillo
        ctx.save()
        ctx.globalAlpha = particle.alpha * (1 - particle.life / particle.maxLife)
        ctx.fillStyle = particle.color
        ctx.shadowColor = particle.color
        ctx.shadowBlur = 8 // Reducido de 10 a 8
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        // Conectar partículas cercanas
        connectParticles(particle, index)

        // Eliminar partículas al final de su vida
        if (particle.life >= particle.maxLife) {
          particles.current.splice(index, 1)

          // Reemplazar partículas base, pero no las creadas por el mouse
          if (particle.colorMode === "fixed" && particles.current.length < 100) {
            particles.current.push(createParticle())
          }
        }
      })

      animationFrameId.current = requestAnimationFrame(animate)
    }

    const connectParticles = (particle: Particle, index: number) => {
      for (let i = index + 1; i < particles.current.length; i++) {
        const dx = particle.x - particles.current[i].x
        const dy = particle.y - particles.current[i].y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 120

        if (distance < maxDistance) {
          // Reducir la opacidad de las conexiones
          const opacity = (1 - distance / maxDistance) * 0.3 // Reducido de 0.5 a 0.3

          // Crear un gradiente entre los colores de las partículas
          const gradient = ctx.createLinearGradient(
            particle.x,
            particle.y,
            particles.current[i].x,
            particles.current[i].y,
          )

          gradient.addColorStop(0, particle.color.replace(")", `, ${opacity})`).replace("hsl", "hsla"))
          gradient.addColorStop(1, particles.current[i].color.replace(")", `, ${opacity})`).replace("hsl", "hsla"))

          ctx.strokeStyle = gradient
          ctx.lineWidth = (1 - distance / maxDistance) * 1.2 // Reducido de 1.5 a 1.2
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(particles.current[i].x, particles.current[i].y)
          ctx.stroke()
        }
      }
    }

    // Inicializar y comenzar la animación
    handleResize()
    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("mouseenter", handleMouseEnter)

    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("mouseenter", handleMouseEnter)
      cancelAnimationFrame(animationFrameId.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ pointerEvents: "none", background: "linear-gradient(135deg, #0a0118 0%, #1a0b3b 100%)" }}
    />
  )
}

export default ParticlesBackground
