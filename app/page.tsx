'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const PLANETS = [
  { key: 'mars', name: 'MARS', class: 'Sativa', thc: '32%', desc: 'Maximum launch power. Immediate cerebral surge.', color: '#ff4820', emoji: '🔴' },
  { key: 'jupiter', name: 'JUPITER', class: 'Hybrid', thc: '28%', desc: 'Perfectly balanced atmospheric high.', color: '#f0b428', emoji: '🟡' },
  { key: 'saturn', name: 'SATURN', class: 'Indica', thc: '26%', desc: 'Heavy, slow-rolling physical descent.', color: '#c4a84a', emoji: '🪐' },
  { key: 'venus', name: 'VENUS', class: 'Sativa', thc: '30%', desc: 'Bright, rapid-firing cerebral surge.', color: '#ff64b4', emoji: '✨' },
  { key: 'neptune', name: 'NEPTUNE', class: 'Indica', thc: '30%', desc: 'Deep, tranquil stabilization.', color: '#4060ff', emoji: '🌊' },
]

function VapeCanvas({ activeColor }: { activeColor: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const rotRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width = canvas.offsetWidth * window.devicePixelRatio
    const H = canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight

    function drawVape(rot: number) {
      if (!ctx) return
      ctx.clearRect(0, 0, w, h)

      const cx = w / 2
      const cy = h / 2
      const vapeH = h * 0.65
      const vapeW = 38
      const perspective = Math.cos(rot)
      const displayW = Math.max(8, vapeW * Math.abs(perspective))
      const isFlipped = perspective < 0

      // Glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 160)
      glow.addColorStop(0, activeColor + '25')
      glow.addColorStop(1, 'transparent')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, w, h)

      const x = cx - displayW / 2
      const y = cy - vapeH / 2

      // Shadow
      ctx.save()
      ctx.shadowColor = activeColor
      ctx.shadowBlur = 40

      // Main body gradient
      const bodyGrad = ctx.createLinearGradient(x, 0, x + displayW, 0)
      if (!isFlipped) {
        bodyGrad.addColorStop(0, '#1a1a1a')
        bodyGrad.addColorStop(0.3, '#2d2d2d')
        bodyGrad.addColorStop(0.7, '#1a1a1a')
        bodyGrad.addColorStop(1, '#111')
      } else {
        bodyGrad.addColorStop(0, '#111')
        bodyGrad.addColorStop(0.3, '#1a1a1a')
        bodyGrad.addColorStop(0.7, '#2d2d2d')
        bodyGrad.addColorStop(1, '#1a1a1a')
      }

      // Body
      const radius = Math.min(displayW / 2, 12)
      ctx.beginPath()
      ctx.moveTo(x + radius, y)
      ctx.lineTo(x + displayW - radius, y)
      ctx.quadraticCurveTo(x + displayW, y, x + displayW, y + radius)
      ctx.lineTo(x + displayW, y + vapeH - radius)
      ctx.quadraticCurveTo(x + displayW, y + vapeH, x + displayW - radius, y + vapeH)
      ctx.lineTo(x + radius, y + vapeH)
      ctx.quadraticCurveTo(x, y + vapeH, x, y + vapeH - radius)
      ctx.lineTo(x, y + radius)
      ctx.quadraticCurveTo(x, y, x + radius, y)
      ctx.closePath()
      ctx.fillStyle = bodyGrad
      ctx.fill()
      ctx.restore()

      // Edge highlight
      ctx.save()
      const edgeX = !isFlipped ? x : x + displayW - 2
      const edgeGrad = ctx.createLinearGradient(0, y, 0, y + vapeH)
      edgeGrad.addColorStop(0, 'rgba(255,255,255,0.15)')
      edgeGrad.addColorStop(0.5, 'rgba(255,255,255,0.05)')
      edgeGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = edgeGrad
      ctx.fillRect(edgeX, y + radius, 2, vapeH - radius * 2)
      ctx.restore()

      // Color band at top
      ctx.save()
      ctx.shadowColor = activeColor
      ctx.shadowBlur = 20
      const bandH = 6
      const bandGrad = ctx.createLinearGradient(x, 0, x + displayW, 0)
      bandGrad.addColorStop(0, activeColor + '80')
      bandGrad.addColorStop(0.5, activeColor)
      bandGrad.addColorStop(1, activeColor + '80')
      ctx.fillStyle = bandGrad
      ctx.fillRect(x, y + 20, displayW, bandH)
      ctx.restore()

      // Mouthpiece
      const mpW = displayW * 0.55
      const mpH = 18
      const mpX = cx - mpW / 2
      ctx.save()
      ctx.shadowColor = activeColor
      ctx.shadowBlur = 15
      const mpGrad = ctx.createLinearGradient(mpX, 0, mpX + mpW, 0)
      mpGrad.addColorStop(0, '#222')
      mpGrad.addColorStop(0.5, '#333')
      mpGrad.addColorStop(1, '#1a1a1a')
      ctx.fillStyle = mpGrad
      ctx.beginPath()
      ctx.moveTo(mpX + 4, y)
      ctx.lineTo(mpX + mpW - 4, y)
      ctx.quadraticCurveTo(mpX + mpW, y, mpX + mpW, y - 4)
      ctx.lineTo(mpX + mpW - 2, y - mpH)
      ctx.lineTo(mpX + 2, y - mpH)
      ctx.lineTo(mpX, y - 4)
      ctx.quadraticCurveTo(mpX, y, mpX + 4, y)
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      // Oil window
      const winY = y + vapeH * 0.25
      const winH = vapeH * 0.3
      const winW = displayW * 0.35
      const winX = cx - winW / 2
      ctx.save()
      ctx.shadowColor = activeColor
      ctx.shadowBlur = 25
      const winGrad = ctx.createLinearGradient(0, winY, 0, winY + winH)
      winGrad.addColorStop(0, activeColor + 'cc')
      winGrad.addColorStop(0.3, activeColor + '99')
      winGrad.addColorStop(0.7, activeColor + '44')
      winGrad.addColorStop(1, activeColor + '22')
      ctx.fillStyle = winGrad
      ctx.fillRect(winX, winY, winW, winH)

      // Shine on window
      ctx.fillStyle = 'rgba(255,255,255,0.12)'
      ctx.fillRect(winX + 1, winY, 2, winH * 0.6)
      ctx.restore()

      // OVERRIDE text on body
      if (displayW > 20) {
        ctx.save()
        ctx.translate(cx, cy + vapeH * 0.1)
        const textAlpha = Math.min(1, Math.abs(perspective) * 2)
        ctx.globalAlpha = textAlpha
        ctx.rotate(-Math.PI / 2)
        ctx.font = `bold ${Math.round(displayW * 0.28)}px monospace`
        ctx.fillStyle = 'rgba(255,255,255,0.5)'
        ctx.letterSpacing = '0.15em'
        ctx.textAlign = 'center'
        ctx.fillText('OVERRIDE', 0, 0)
        ctx.restore()
      }

      // USB-C port at bottom
      const portW = displayW * 0.4
      const portH = 4
      const portX = cx - portW / 2
      ctx.save()
      ctx.fillStyle = '#111'
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'
      ctx.lineWidth = 1
      ctx.fillRect(portX, y + vapeH - 12, portW, portH)
      ctx.strokeRect(portX, y + vapeH - 12, portW, portH)
      ctx.restore()

      // Particles
      ctx.save()
      for (let i = 0; i < 8; i++) {
        const angle = (rot * 2 + i * (Math.PI * 2 / 8))
        const radius2 = 80 + Math.sin(rot * 3 + i) * 20
        const px = cx + Math.cos(angle) * radius2
        const py = cy + Math.sin(angle) * radius2 * 0.3
        const alpha = (Math.sin(rot * 2 + i) + 1) / 2 * 0.4
        ctx.beginPath()
        ctx.arc(px, py, 2, 0, Math.PI * 2)
        ctx.fillStyle = activeColor + Math.round(alpha * 255).toString(16).padStart(2, '0')
        ctx.fill()
      }
      ctx.restore()
    }

    function animate() {
      rotRef.current += 0.012
      drawVape(rotRef.current)
      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [activeColor])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}

export default function HomePage() {
  const [activePlanet, setActivePlanet] = useState(0)
  const planet = PLANETS[activePlanet]
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ background: '#060608', minHeight: '100vh', color: 'white', fontFamily: 'monospace', overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: '56px',
        background: scrolled ? 'rgba(6,6,8,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.3s',
      }}>
        <span style={{ fontWeight: 900, fontSize: '16px', letterSpacing: '0.15em' }}>
          OVERRIDE<sup style={{ fontSize: '8px', opacity: 0.4 }}>™</sup>
        </span>
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          <a href="#strains" style={{ fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>STRAINS</a>
          <a href="#product" style={{ fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>PRODUCT</a>
          <Link href="/mission" style={{
            fontSize: '11px', letterSpacing: '0.15em', color: '#060608', textDecoration: 'none',
            background: 'white', padding: '8px 20px', fontWeight: 700,
          }}>
            SCAN →
          </Link>
        </div>
      </nav>

      {/* HERO — 3D vape + planet selector */}
      <section style={{
        minHeight: '100vh', display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        padding: '80px 64px 60px',
        position: 'relative', overflow: 'hidden',
        maxWidth: '1200px', margin: '0 auto',
      }}>

        {/* Ambient bg */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: `radial-gradient(ellipse 60% 60% at 70% 50%, ${planet.color}12 0%, transparent 70%)`,
          pointerEvents: 'none', transition: 'background 1s',
          zIndex: 0,
        }} />

        {/* Left — text */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', margin: '0 0 20px' }}>
            SPACESHIP STRAINS™ · LOS ANGELES · 2026
          </p>

          <h1 style={{
            fontSize: 'clamp(72px, 10vw, 120px)', fontWeight: 900,
            letterSpacing: '-0.03em', lineHeight: 0.9, margin: '0 0 16px',
          }}>
            OVER<br />RIDE
          </h1>

          <p style={{
            fontSize: '14px', letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.3)', margin: '0 0 40px', textTransform: 'uppercase',
          }}>
            Override the Universe
          </p>

          {/* Active planet info */}
          <div style={{
            background: `${planet.color}10`, border: `1px solid ${planet.color}30`,
            padding: '20px 24px', marginBottom: '32px',
            transition: 'all 0.4s',
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '24px' }}>{planet.emoji}</span>
              <div>
                <span style={{ fontSize: '20px', fontWeight: 900, color: planet.color, letterSpacing: '0.1em' }}>
                  {planet.name}
                </span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginLeft: '12px', letterSpacing: '0.1em' }}>
                  {planet.class} · {planet.thc} THC
                </span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.6 }}>
              {planet.desc}
            </p>
          </div>

          {/* Planet pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '40px' }}>
            {PLANETS.map((p, i) => (
              <button
                key={p.key}
                onClick={() => setActivePlanet(i)}
                style={{
                  padding: '8px 16px', border: `1px solid ${i === activePlanet ? p.color : 'rgba(255,255,255,0.12)'}`,
                  background: i === activePlanet ? `${p.color}20` : 'transparent',
                  color: i === activePlanet ? p.color : 'rgba(255,255,255,0.4)',
                  fontSize: '11px', letterSpacing: '0.12em', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {p.emoji} {p.name}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href={`/mission?planet=${planet.key}`} style={{
              padding: '14px 32px', background: planet.color,
              color: '#060608', fontSize: '12px', letterSpacing: '0.15em',
              fontWeight: 700, textDecoration: 'none', transition: 'all 0.3s',
            }}>
              SCAN {planet.name} →
            </Link>
            <a href="#product" style={{
              padding: '14px 24px', border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.5)', fontSize: '12px', letterSpacing: '0.12em',
              textDecoration: 'none',
            }}>
              VIEW HARDWARE
            </a>
          </div>
        </div>

        {/* Right — 3D vape */}
        <div style={{
          position: 'relative', zIndex: 1,
          height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <VapeCanvas activeColor={planet.color} />

          {/* Floating label */}
          <div style={{
            position: 'absolute', bottom: '60px', left: '50%', transform: 'translateX(-50%)',
            textAlign: 'center', pointerEvents: 'none',
          }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.25)', margin: 0 }}>
              XODOS PRO · 1.0G · iKRUSHER
            </p>
          </div>
        </div>
      </section>

      {/* COMPLIANCE STRIP */}
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '14px 24px', textAlign: 'center',
      }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.2)', margin: 0 }}>
          ✓ LAB TESTED &nbsp;·&nbsp; ✓ STATE LICENSED &nbsp;·&nbsp; ✓ SCHEDULE III COMPLIANT &nbsp;·&nbsp; ✓ CALIFORNIA DISPENSARIES ONLY · 21+
        </p>
      </div>

      {/* STRAINS GRID */}
      <section id="strains" style={{ padding: '100px 64px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '56px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)', margin: '0 0 12px' }}>
            // FIVE PLANETS · FIVE EXPERIENCES
          </p>
          <h2 style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>
            SELECT YOUR ORBIT
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '2px' }}>
          {PLANETS.map((p, i) => (
            <Link
              key={p.key}
              href={`/mission?planet=${p.key}`}
              onMouseEnter={() => setActivePlanet(i)}
              style={{
                display: 'block', textDecoration: 'none', color: 'white',
                background: `${p.color}08`,
                border: `1px solid ${p.color}20`,
                padding: '28px 20px',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: '36px', display: 'block', marginBottom: '12px' }}>{p.emoji}</span>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: p.color, margin: '0 0 4px', letterSpacing: '0.06em' }}>
                {p.name}
              </h3>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', margin: '0 0 12px', letterSpacing: '0.1em' }}>
                {p.class} · {p.thc}
              </p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: '0 0 20px', lineHeight: 1.6 }}>
                {p.desc}
              </p>
              <span style={{ fontSize: '11px', color: p.color, letterSpacing: '0.12em' }}>
                SCAN →
              </span>
              <div style={{ height: '2px', background: p.color, opacity: 0.3, marginTop: '20px' }} />
            </Link>
          ))}
        </div>
      </section>

      {/* PRODUCT SECTION */}
      <section id="product" style={{
        padding: '100px 64px',
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)', margin: '0 0 12px' }}>
              // HARDWARE
            </p>
            <h2 style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 24px' }}>
              XODOS PRO
            </h2>
            <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(255,255,255,0.45)', margin: '0 0 32px' }}>
              Classy compact all-in-one disposable vape. Premium hardware by iKrusher — the same manufacturer trusted by over 1,500 cannabis brands. 1.0g capacity, inhale activated, USB-C rechargeable.
            </p>
            {[
              ['FORMAT', 'All-In-One Disposable'],
              ['CAPACITY', '1.0g'],
              ['ACTIVATION', 'Inhale Activated'],
              ['CHARGING', 'USB-C'],
              ['OIL TYPE', 'Premium Distillate'],
              ['COMPLIANCE', 'California DCC Licensed'],
            ].map(([label, value]) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                padding: '10px 0', fontSize: '12px',
              }}>
                <span style={{ letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)' }}>{label}</span>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            {/* Product image from iKrusher */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div style={{
                position: 'absolute', inset: '-40px',
                background: `radial-gradient(circle, ${planet.color}15 0%, transparent 70%)`,
                transition: 'background 1s',
              }} />
              <img
                src="https://ikrusher.com/cdn/shop/files/Xodos-Pro-1.0mL.png?v=1781000077"
                alt="XODOS PRO by iKrusher"
                style={{ width: '240px', filter: 'drop-shadow(0 0 40px rgba(255,255,255,0.08))', position: 'relative' }}
              />
            </div>
            <p style={{ fontSize: '11px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', marginTop: '24px' }}>
              HARDWARE BY iKRUSHER · BALDWIN PARK, CA
            </p>
          </div>
        </div>
      </section>

      {/* MISSION BRIEFING */}
      <section style={{ padding: '100px 64px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)', margin: '0 0 16px' }}>
          // DIGITAL MANIFEST SYSTEM
        </p>
        <h2 style={{ fontSize: 'clamp(28px, 6vw, 52px)', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 24px' }}>
          MISSION BRIEFING™
        </h2>
        <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.4)', margin: '0 0 48px', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto' }}>
          Every OVERRIDE product includes a QR code. Scan to receive your personal boarding pass, unlock your planet, and track your orbit.
        </p>
        <Link href="/mission" style={{
          display: 'inline-block', padding: '16px 48px',
          background: 'white', color: '#060608',
          fontSize: '12px', letterSpacing: '0.2em', fontWeight: 700, textDecoration: 'none',
        }}>
          BEGIN MISSION BRIEFING →
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '48px 64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '16px',
      }}>
        <div>
          <p style={{ fontWeight: 900, fontSize: '14px', letterSpacing: '0.15em', margin: '0 0 4px' }}>
            OVERRIDE<sup style={{ fontSize: '7px', opacity: 0.4 }}>™</sup>
          </p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', margin: 0, letterSpacing: '0.1em' }}>
            BY SPACESHIP STRAINS™ · LOS ANGELES
          </p>
        </div>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.15)', margin: 0, maxWidth: '400px', lineHeight: 1.7, textAlign: 'right' }}>
          For use by individuals 21 years of age or older. Available at licensed California dispensaries only. Keep out of reach of children.
        </p>
      </footer>

    </div>
  )
}