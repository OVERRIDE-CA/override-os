'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const PLANETS = [
  { key: 'mars', name: 'MARS', class: 'Sativa', thc: '32%', desc: 'Maximum launch power. Immediate cerebral surge. Proceed with caution.', color: '#ff4820', emoji: '🔴', tags: ['Blastoff', 'Heavy Hitter', 'Deep Space'] },
  { key: 'jupiter', name: 'JUPITER', class: 'Hybrid', thc: '28%', desc: 'Perfectly balanced atmospheric high. Best entry point for any level.', color: '#f0b428', emoji: '🟡', tags: ['Gas Giant', 'Atmospheric', 'Hyper-Balance'] },
  { key: 'saturn', name: 'SATURN', class: 'Indica', thc: '26%', desc: 'Heavy, slow-rolling physical descent. Maximum grounding and stability.', color: '#c4a84a', emoji: '🪐', tags: ['Deep Gravity', 'Ring System', 'Heavy Orbit'] },
  { key: 'venus', name: 'VENUS', class: 'Sativa', thc: '30%', desc: 'Bright, rapid-firing cerebral surge. Built for creative minds.', color: '#ff64b4', emoji: '✨', tags: ['Solar Flare', 'Ionic Glow', 'Elevated High'] },
  { key: 'neptune', name: 'NEPTUNE', class: 'Indica', thc: '30%', desc: 'Deep, tranquil stabilization. Quiet, endless calm of the outer system.', color: '#4060ff', emoji: '🌊', tags: ['Deep Blue', 'Abyssal Class', 'Sub-Orbital'] },
]

function VapeCanvas({ color, size = 1 }: { color: string; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const rotRef = useRef(0)
  const colorRef = useRef(color)

  useEffect(() => { colorRef.current = color }, [color])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
    }
    resize()

    function draw() {
      if (!ctx || !canvas) return
      const w = canvas.offsetWidth, h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)
      const c = colorRef.current
      const rot = rotRef.current
      const cx = w / 2, cy = h / 2
      const vH = h * 0.72, vW = 44 * size
      const persp = Math.cos(rot)
      const dW = Math.max(6, vW * Math.abs(persp))
      const x = cx - dW / 2, y = cy - vH / 2

      // ambient glow
      const g = ctx.createRadialGradient(cx, cy + vH * 0.1, 0, cx, cy, h * 0.55)
      g.addColorStop(0, c + '20'); g.addColorStop(1, 'transparent')
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h)

      // floor reflection
      const rf = ctx.createLinearGradient(0, cy + vH / 2, 0, h)
      rf.addColorStop(0, c + '15'); rf.addColorStop(1, 'transparent')
      ctx.fillStyle = rf
      ctx.save()
      ctx.scale(1, -0.25)
      ctx.translate(0, -(cy + vH / 2) * 4 - vH)
      const r2 = Math.min(dW / 2, 14)
      ctx.beginPath()
      ctx.moveTo(x + r2, y); ctx.lineTo(x + dW - r2, y)
      ctx.quadraticCurveTo(x + dW, y, x + dW, y + r2)
      ctx.lineTo(x + dW, y + vH - r2)
      ctx.quadraticCurveTo(x + dW, y + vH, x + dW - r2, y + vH)
      ctx.lineTo(x + r2, y + vH)
      ctx.quadraticCurveTo(x, y + vH, x, y + vH - r2)
      ctx.lineTo(x, y + r2)
      ctx.quadraticCurveTo(x, y, x + r2, y)
      ctx.closePath()
      ctx.fillStyle = rf; ctx.globalAlpha = 0.4; ctx.fill()
      ctx.restore(); ctx.globalAlpha = 1

      // body
      ctx.save()
      ctx.shadowColor = c; ctx.shadowBlur = 30
      const bd = ctx.createLinearGradient(x, 0, x + dW, 0)
      const flip = persp < 0
      bd.addColorStop(0, flip ? '#111' : '#1e1e1e')
      bd.addColorStop(0.35, flip ? '#1e1e1e' : '#2a2a2a')
      bd.addColorStop(0.65, flip ? '#2a2a2a' : '#1e1e1e')
      bd.addColorStop(1, flip ? '#1e1e1e' : '#111')
      const r = Math.min(dW / 2, 14)
      ctx.beginPath()
      ctx.moveTo(x + r, y); ctx.lineTo(x + dW - r, y)
      ctx.quadraticCurveTo(x + dW, y, x + dW, y + r)
      ctx.lineTo(x + dW, y + vH - r)
      ctx.quadraticCurveTo(x + dW, y + vH, x + dW - r, y + vH)
      ctx.lineTo(x + r, y + vH)
      ctx.quadraticCurveTo(x, y + vH, x, y + vH - r)
      ctx.lineTo(x, y + r)
      ctx.quadraticCurveTo(x, y, x + r, y)
      ctx.closePath()
      ctx.fillStyle = bd; ctx.fill()
      ctx.restore()

      // color band
      ctx.save()
      ctx.shadowColor = c; ctx.shadowBlur = 20
      const bG = ctx.createLinearGradient(x, 0, x + dW, 0)
      bG.addColorStop(0, c + '60'); bG.addColorStop(0.5, c); bG.addColorStop(1, c + '60')
      ctx.fillStyle = bG; ctx.fillRect(x, y + 22, dW, 5)
      ctx.restore()

      // mouthpiece
      const mpW = dW * 0.52, mpH = 22
      const mpX = cx - mpW / 2
      ctx.save()
      ctx.shadowColor = c; ctx.shadowBlur = 12
      const mp = ctx.createLinearGradient(mpX, 0, mpX + mpW, 0)
      mp.addColorStop(0, '#1a1a1a'); mp.addColorStop(0.5, '#282828'); mp.addColorStop(1, '#1a1a1a')
      ctx.fillStyle = mp
      ctx.beginPath()
      ctx.moveTo(mpX + 3, y); ctx.lineTo(mpX + mpW - 3, y)
      ctx.quadraticCurveTo(mpX + mpW, y, mpX + mpW, y - 3)
      ctx.lineTo(mpX + mpW - 1, y - mpH); ctx.lineTo(mpX + 1, y - mpH)
      ctx.lineTo(mpX, y - 3); ctx.quadraticCurveTo(mpX, y, mpX + 3, y)
      ctx.closePath(); ctx.fill()
      ctx.restore()

      // oil window
      const wY = y + vH * 0.22, wH = vH * 0.32, wW = dW * 0.32, wX = cx - wW / 2
      ctx.save()
      ctx.shadowColor = c; ctx.shadowBlur = 30
      const wG = ctx.createLinearGradient(0, wY, 0, wY + wH)
      wG.addColorStop(0, c + 'dd'); wG.addColorStop(0.4, c + '99')
      wG.addColorStop(0.8, c + '44'); wG.addColorStop(1, c + '11')
      ctx.fillStyle = wG; ctx.fillRect(wX, wY, wW, wH)
      ctx.fillStyle = 'rgba(255,255,255,0.14)'; ctx.fillRect(wX + 1, wY, 2, wH * 0.5)
      ctx.restore()

      // OVERRIDE text
      if (dW > 22) {
        ctx.save()
        ctx.translate(cx, cy + vH * 0.08)
        ctx.globalAlpha = Math.min(1, Math.abs(persp) * 2.5)
        ctx.rotate(-Math.PI / 2)
        ctx.font = `900 ${Math.round(dW * 0.26)}px monospace`
        ctx.fillStyle = 'rgba(255,255,255,0.45)'
        ctx.textAlign = 'center'; ctx.fillText('OVERRIDE', 0, 0)
        ctx.restore()
      }

      // USB-C
      ctx.save()
      ctx.fillStyle = '#0d0d0d'
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1
      const pW = dW * 0.38, pX = cx - pW / 2
      ctx.fillRect(pX, y + vH - 10, pW, 4)
      ctx.strokeRect(pX, y + vH - 10, pW, 4)
      ctx.restore()

      // edge highlight
      ctx.save()
      const eG = ctx.createLinearGradient(0, y, 0, y + vH)
      eG.addColorStop(0, 'rgba(255,255,255,0.18)')
      eG.addColorStop(0.4, 'rgba(255,255,255,0.06)')
      eG.addColorStop(1, 'transparent')
      ctx.fillStyle = eG
      ctx.fillRect(flip ? x + dW - 2 : x, y + r, 2, vH - r * 2)
      ctx.restore()

      // orbit particles
      for (let i = 0; i < 10; i++) {
        const a = rot * 1.5 + i * (Math.PI * 2 / 10)
        const pr = (70 + Math.sin(rot * 2 + i) * 18) * size
        const px = cx + Math.cos(a) * pr
        const py = cy + Math.sin(a) * pr * 0.25
        const alpha = ((Math.sin(rot * 2 + i * 0.7) + 1) / 2) * 0.5
        ctx.beginPath(); ctx.arc(px, py, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = c + Math.round(alpha * 255).toString(16).padStart(2, '0')
        ctx.fill()
      }
    }

    const animate = () => {
      rotRef.current += 0.013
      draw()
      frameRef.current = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [size])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
}

export default function HomePage() {
  const [activePlanet, setActivePlanet] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const p = PLANETS[activePlanet]

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    const onMouse = (e: MouseEvent) => {
      setMouseX((e.clientX / window.innerWidth - 0.5) * 2)
      setMouseY((e.clientY / window.innerHeight - 0.5) * 2)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMouse)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('mousemove', onMouse) }
  }, [])

  const heroParallax = scrollY * 0.4
  const textParallax = scrollY * 0.2

  return (
    <div style={{ background: '#060608', minHeight: '100vh', color: 'white', fontFamily: 'monospace', overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: '56px',
        background: scrollY > 60 ? 'rgba(6,6,8,0.96)' : 'transparent',
        backdropFilter: scrollY > 60 ? 'blur(16px)' : 'none',
        borderBottom: scrollY > 60 ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <span style={{ fontWeight: 900, fontSize: '16px', letterSpacing: '0.18em' }}>
          OVERRIDE<sup style={{ fontSize: '7px', opacity: 0.35 }}>™</sup>
        </span>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {['STRAINS', 'PRODUCT', 'MISSION'].map(n => (
            <a key={n} href={`#${n.toLowerCase()}`} style={{
              fontSize: '11px', letterSpacing: '0.18em',
              color: 'rgba(255,255,255,0.35)', textDecoration: 'none',
              transition: 'color 0.2s',
            }}>{n}</a>
          ))}
          <Link href="/mission" style={{
            fontSize: '11px', letterSpacing: '0.15em', color: '#060608',
            textDecoration: 'none', background: 'white', padding: '9px 22px', fontWeight: 700,
          }}>SCAN PRODUCT →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} style={{
        minHeight: '100vh', position: 'relative', overflow: 'hidden',
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        alignItems: 'center', padding: '80px 64px 40px',
        maxWidth: '1300px', margin: '0 auto',
      }}>
        {/* deep space bg */}
        <div style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse 70% 70% at ${55 + mouseX * 5}% ${45 + mouseY * 5}%, ${p.color}14 0%, transparent 65%)`,
          transition: 'background 0.8s cubic-bezier(0.4,0,0.2,1)',
        }} />

        {/* star field */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          {[...Array(80)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${(i * 137.5) % 100}%`,
              top: `${(i * 97.3) % 100}%`,
              width: i % 5 === 0 ? '2px' : '1px',
              height: i % 5 === 0 ? '2px' : '1px',
              background: 'white',
              borderRadius: '50%',
              opacity: 0.08 + (i % 7) * 0.05,
            }} />
          ))}
        </div>

        {/* LEFT */}
        <div style={{ position: 'relative', zIndex: 2, transform: `translateY(${-textParallax}px)` }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.35em', color: 'rgba(255,255,255,0.28)', margin: '0 0 24px' }}>
            SPACESHIP STRAINS™ · LOS ANGELES · CA · 2026
          </p>
          <h1 style={{
            fontSize: 'clamp(80px, 11vw, 140px)', fontWeight: 900,
            letterSpacing: '-0.03em', lineHeight: 0.88, margin: '0 0 20px',
            textShadow: `0 0 80px ${p.color}30`,
            transition: 'text-shadow 0.8s',
          }}>
            OVER<br />RIDE
          </h1>
          <p style={{
            fontSize: '13px', letterSpacing: '0.22em',
            color: 'rgba(255,255,255,0.3)', margin: '0 0 44px',
          }}>
            OVERRIDE THE UNIVERSE
          </p>

          {/* active planet card */}
          <div style={{
            border: `1px solid ${p.color}35`,
            background: `${p.color}0c`,
            padding: '20px 24px', marginBottom: '28px',
            transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <span style={{ fontSize: '28px' }}>{p.emoji}</span>
              <div>
                <span style={{ fontSize: '22px', fontWeight: 900, color: p.color, letterSpacing: '0.08em' }}>{p.name}</span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginLeft: '12px', letterSpacing: '0.12em' }}>
                  {p.class} · {p.thc} THC
                </span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.42)', margin: '0 0 12px', lineHeight: 1.65 }}>{p.desc}</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {p.tags.map(t => (
                <span key={t} style={{
                  fontSize: '10px', letterSpacing: '0.1em', padding: '3px 10px',
                  border: `1px solid ${p.color}30`, color: p.color, opacity: 0.75,
                }}>{t}</span>
              ))}
            </div>
          </div>

          {/* planet selector */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '36px', flexWrap: 'wrap' }}>
            {PLANETS.map((pl, i) => (
              <button key={pl.key} onClick={() => setActivePlanet(i)} style={{
                padding: '7px 14px',
                border: `1px solid ${i === activePlanet ? pl.color : 'rgba(255,255,255,0.1)'}`,
                background: i === activePlanet ? `${pl.color}18` : 'transparent',
                color: i === activePlanet ? pl.color : 'rgba(255,255,255,0.35)',
                fontSize: '11px', letterSpacing: '0.1em', cursor: 'pointer',
                transition: 'all 0.25s',
              }}>
                {pl.emoji} {pl.name}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href={`/mission?planet=${p.key}`} style={{
              padding: '14px 32px', background: p.color, color: '#060608',
              fontSize: '12px', letterSpacing: '0.15em', fontWeight: 700,
              textDecoration: 'none', transition: 'all 0.3s',
            }}>
              SCAN {p.name} →
            </Link>
            <a href="#strains" style={{
              padding: '14px 24px', border: '1px solid rgba(255,255,255,0.14)',
              color: 'rgba(255,255,255,0.45)', fontSize: '12px',
              letterSpacing: '0.12em', textDecoration: 'none',
            }}>
              ALL PLANETS
            </a>
          </div>
        </div>

        {/* RIGHT — vape */}
        <div style={{
          position: 'relative', zIndex: 2, height: '620px',
          transform: `translateY(${-heroParallax * 0.5}px) rotateY(${mouseX * 4}deg) rotateX(${-mouseY * 2}deg)`,
          transition: 'transform 0.1s linear',
          perspective: '1000px',
        }}>
          <VapeCanvas color={p.color} />
          <div style={{
            position: 'absolute', bottom: '48px', left: '50%', transform: 'translateX(-50%)',
            textAlign: 'center', pointerEvents: 'none',
          }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.28em', color: 'rgba(255,255,255,0.2)', margin: 0 }}>
              OVERRIDE™ · 1.0G · PREMIUM DISTILLATE
            </p>
          </div>
        </div>
      </section>

      {/* COMPLIANCE STRIP */}
      <div style={{
        background: 'rgba(255,255,255,0.025)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '14px', textAlign: 'center',
        transform: `translateY(${Math.max(0, (scrollY - 500) * 0.05)}px)`,
      }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', margin: 0 }}>
          ✓ LAB TESTED &nbsp;·&nbsp; ✓ STATE LICENSED &nbsp;·&nbsp; ✓ SCHEDULE III COMPLIANT &nbsp;·&nbsp; ✓ CALIFORNIA DISPENSARIES · 21+
        </p>
      </div>

      {/* STRAINS */}
      <section id="strains" style={{ padding: '120px 64px', maxWidth: '1300px', margin: '0 auto' }}>
        <div style={{ marginBottom: '64px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.32em', color: 'rgba(255,255,255,0.25)', margin: '0 0 14px' }}>
            // FIVE PLANETS · FIVE EXPERIENCES
          </p>
          <h2 style={{ fontSize: 'clamp(36px, 7vw, 64px)', fontWeight: 900, letterSpacing: '-0.025em', margin: 0 }}>
            SELECT YOUR ORBIT
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1px' }}>
          {PLANETS.map((pl, i) => (
            <Link key={pl.key} href={`/mission?planet=${pl.key}`}
              onMouseEnter={() => setActivePlanet(i)}
              style={{
                display: 'flex', flexDirection: 'column',
                textDecoration: 'none', color: 'white',
                background: `${pl.color}07`,
                border: `1px solid ${pl.color}18`,
                padding: '28px 22px',
                transition: 'all 0.25s',
              }}>
              <span style={{ fontSize: '40px', marginBottom: '16px', display: 'block' }}>{pl.emoji}</span>
              <h3 style={{ fontSize: '22px', fontWeight: 900, color: pl.color, margin: '0 0 4px', letterSpacing: '0.06em' }}>{pl.name}</h3>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', margin: '0 0 14px', letterSpacing: '0.1em' }}>
                {pl.class} · {pl.thc}
              </p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.38)', margin: '0 0 20px', lineHeight: 1.65, flex: 1 }}>
                {pl.desc}
              </p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {pl.tags.map(t => (
                  <span key={t} style={{
                    fontSize: '9px', letterSpacing: '0.08em', padding: '3px 8px',
                    border: `1px solid ${pl.color}28`, color: pl.color, opacity: 0.7,
                  }}>{t}</span>
                ))}
              </div>
              <span style={{ fontSize: '11px', letterSpacing: '0.15em', color: pl.color }}>
                SCAN →
              </span>
              <div style={{ height: '2px', background: pl.color, opacity: 0.35, marginTop: '16px' }} />
            </Link>
          ))}
        </div>
      </section>

      {/* PRODUCT */}
      <section id="product" style={{
        padding: '120px 64px',
        background: 'rgba(255,255,255,0.015)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '0.32em', color: 'rgba(255,255,255,0.25)', margin: '0 0 14px' }}>// THE DEVICE</p>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 900, letterSpacing: '-0.025em', margin: '0 0 24px', lineHeight: 1.1 }}>
              OVERRIDE<br />VAPE PEN
            </h2>
            <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(255,255,255,0.42)', margin: '0 0 36px' }}>
              Compact all-in-one disposable. Premium hardware engineered for maximum performance. Inhale activated. No setup. No cartridges. Just scan, activate, and orbit.
            </p>
            {[
              ['FORMAT', 'All-In-One Disposable'],
              ['CAPACITY', '1.0g'],
              ['ACTIVATION', 'Inhale Activated'],
              ['CHARGING', 'USB-C Rechargeable'],
              ['OIL TYPE', 'Premium Distillate'],
              ['TESTING', 'COA Verified Every Batch'],
              ['LICENSE', 'California DCC Compliant'],
            ].map(([label, value]) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                padding: '11px 0', fontSize: '12px',
              }}>
                <span style={{ letterSpacing: '0.18em', color: 'rgba(255,255,255,0.28)' }}>{label}</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{ height: '560px' }}>
            <VapeCanvas color={p.color} />
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section id="mission" style={{ padding: '120px 64px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.32em', color: 'rgba(255,255,255,0.25)', margin: '0 0 16px' }}>
          // DIGITAL MANIFEST SYSTEM
        </p>
        <h2 style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 900, letterSpacing: '-0.025em', margin: '0 0 24px' }}>
          MISSION BRIEFING
        </h2>
        <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'rgba(255,255,255,0.38)', margin: '0 0 56px', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto' }}>
          Every OVERRIDE product includes a QR code. Scan to receive your personal boarding pass, unlock your planet, and track your orbit across California dispensaries.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', marginBottom: '56px' }}>
          {[
            { n: '01', label: 'SCAN', desc: 'QR code on every product' },
            { n: '02', label: 'BOARD', desc: 'Receive your boarding pass' },
            { n: '03', label: 'ORBIT', desc: 'Track your planet journey' },
            { n: '04', label: 'UNLOCK', desc: 'Earn Paradise access' },
          ].map(s => (
            <div key={s.label} style={{
              padding: '24px 20px', border: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(255,255,255,0.02)', textAlign: 'left',
            }}>
              <p style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', margin: '0 0 10px' }}>{s.n}</p>
              <p style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 8px', letterSpacing: '0.1em' }}>{s.label}</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.32)', margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
        <Link href="/mission" style={{
          display: 'inline-block', padding: '16px 52px',
          background: 'white', color: '#060608',
          fontSize: '12px', letterSpacing: '0.22em', fontWeight: 700, textDecoration: 'none',
        }}>
          BEGIN MISSION BRIEFING →
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '48px 64px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        flexWrap: 'wrap', gap: '24px',
      }}>
        <div>
          <p style={{ fontWeight: 900, fontSize: '15px', letterSpacing: '0.18em', margin: '0 0 6px' }}>
            OVERRIDE<sup style={{ fontSize: '7px', opacity: 0.35 }}>™</sup>
          </p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', margin: 0, letterSpacing: '0.12em' }}>
            BY SPACESHIP STRAINS™ · LOS ANGELES · © 2026
          </p>
        </div>
        <p style={{
          fontSize: '11px', color: 'rgba(255,255,255,0.14)', margin: 0,
          maxWidth: '420px', lineHeight: 1.8, textAlign: 'right',
        }}>
          For use by individuals 21 years of age or older only. Available at licensed California dispensaries. Keep out of reach of children. State licensed and compliant.
        </p>
      </footer>

    </div>
  )
}