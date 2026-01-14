'use client'

import React, { useEffect, useRef } from 'react'

export const NeuralNetworkBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number
        let particles: Particle[] = []
        const mouse = { x: -100, y: -100, radius: 180 } // Increased radius slightly

        class Particle {
            x: number
            y: number
            size: number
            speedX: number
            speedY: number

            constructor() {
                this.x = Math.random() * canvas!.width
                this.y = Math.random() * canvas!.height
                this.size = Math.random() * 2 + 0.5
                this.speedX = (Math.random() - 0.5) * 0.4
                this.speedY = (Math.random() - 0.5) * 0.4
            }

            update() {
                this.x += this.speedX
                this.y += this.speedY

                if (this.x > canvas!.width) this.x = 0
                if (this.x < 0) this.x = canvas!.width
                if (this.y > canvas!.height) this.y = 0
                if (this.y < 0) this.y = canvas!.height
            }

            draw() {
                if (!ctx) return
                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)' // More visible particles
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fill()
            }
        }

        const init = () => {
            particles = []
            const numberOfParticles = (canvas.width * canvas.height) / 12000 // Slightly higher density
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle())
            }
        }

        const connect = () => {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x
                    const dy = particles[a].y - particles[b].y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < 150) { // Increased connection distance
                        const opacity = 1 - distance / 150
                        ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.4})` // Doubled visibility
                        ctx.lineWidth = 1
                        ctx.beginPath()
                        ctx.moveTo(particles[a].x, particles[a].y)
                        ctx.lineTo(particles[b].x, particles[b].y)
                        ctx.stroke()
                    }
                }

                // Mouse connection - White glowing lines
                const dx = particles[a].x - mouse.x
                const dy = particles[a].y - mouse.y
                const distance = Math.sqrt(dx * dx + dy * dy)
                if (distance < mouse.radius) {
                    const opacity = 1 - distance / mouse.radius
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.7})` // Increased visibility from 0.4 to 0.7
                    ctx.lineWidth = 1.2 // Slightly thicker lines for mouse
                    ctx.beginPath()
                    ctx.moveTo(particles[a].x, particles[a].y)
                    ctx.lineTo(mouse.x, mouse.y)
                    ctx.stroke()
                }
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            particles.forEach((p) => {
                p.update()
                p.draw()
            })
            connect()
            animationFrameId = requestAnimationFrame(animate)
        }

        const handleResize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            init()
        }

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX
            mouse.y = e.clientY
        }

        window.addEventListener('resize', handleResize)
        window.addEventListener('mousemove', handleMouseMove)
        handleResize()
        animate()

        return () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('mousemove', handleMouseMove)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[5]"
            style={{ background: 'transparent' }}
        />
    )
}
