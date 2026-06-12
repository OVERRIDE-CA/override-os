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

function VapeCanvas({ color }: { color: string }) {
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
    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    function draw() {
      if (!ctx || !canvas) return
      const w = canvas.offsetWidth, h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)
      const c = colorRef.current
      const rot = rotRef.current
      const cx = w / 2, cy = h / 2
      const vH = h * 0.68, vW = Math.min(46, w * 0.14)
      const persp = Math.cos(rot)
      const dW = Math.max(6, vW * Math.abs(persp))
      const x = cx - dW / 2, y = cy - vH / 2

      // glow
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, h * 0.5)
      g.addColorStop(0, c + '22'); g.addColorStop(1, 'transparent')
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h)

      // body
      ctx.save()
      ctx.shadowColor = c; ctx.shadowBlur = 25
      const bd = ctx.createLinearGradient(x, 0, x + dW, 0)
      const flip = persp < 0
      bd.addColorStop(0, flip ? '#111' : '#1e1e1e')
      bd.addColorStop(0.4, flip ? '#1e1e1e' : '#2a2a2a')
      bd.addColorStop(0.6, flip ? '#2a2a2a' : '#1e1e1e')
      bd.addColorStop(1, flip ? '#1e1e1e' : '#111')
      const r = Math.min(dW / 2, 13)
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
      ctx.shadowColor = c; ctx.shadowBlur = 16
      const bG = ctx.createLinearGradient(x, 0, x + dW, 0)
      bG.addColorStop(0, c + '55'); bG.addColorStop(0.5, c); bG.addColorStop(1, c + '55')
      ctx.fillStyle = bG; ctx.fillRect(x, y + 20, dW, 5)
      ctx.restore()

      // mouthpiece
      const mpW = dW * 0.5, mpH = 20, mpX = cx - mpW / 2
      ctx.save()
      ctx.shadowColor = c; ctx.shadowBlur = 10
      const mp = ctx.createLinearGradient(mpX, 0, mpX + mpW, 0)
      mp.addColorStop(0, '#1a1a1a'); mp.addColorStop(0.5, '#2a2a2a'); mp.addColorStop(1, '#1a1a1a')
      ctx.fillStyle = mp
      ctx.beginPath()
      ctx.moveTo(mpX + 3, y); ctx.lineTo(mpX + mpW - 3, y)
      ctx.lineTo(mpX + mpW, y - 3); ctx.lineTo(mpX + mpW - 1, y - mpH)
      ctx.lineTo(mpX + 1, y - mpH); ctx.lineTo(mpX, y - 3)
      ctx.closePath(); ctx.fill()
      ctx.restore()

      // oil window
      const wY = y + vH * 0.22, wH = vH * 0.3, wW = dW * 0.3, wX = cx - wW / 2
      ctx.save()
      ctx.shadowColor = c; ctx.shadowBlur = 28
      const wG = ctx.createLinearGradient(0, wY, 0, wY + wH)
      wG.addColorStop(0, c + 'dd'); wG.addColorStop(0.5, c + '88')
      wG.addColorStop(0.85, c + '33'); wG.addColorStop(1, c + '11')
      ctx.fillStyle = wG; ctx.fillRect(wX, wY, wW, wH)
      ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(wX + 1, wY, 2, wH * 0.5)
      ctx.restore()

      // text
      if (dW > 20) {
        ctx.save()
        ctx.translate(cx, cy + vH * 0.08)
        ctx.globalAlpha = Math.min(1, Math.abs(persp) * 2.5)
        ctx.rotate(-Math.PI / 2)
        ctx.font = `900 ${Math.round(dW * 0.25)}px monospace`
        ctx.fillStyle = 'rgba(255,255,255,0.4)'
        ctx.textAlign = 'center'; ctx.fillText('OVERRIDE', 0, 0)
        ctx.restore()
      }

      // usb-c
      const pW = dW * 0.36, pX = cx - pW / 2
      ctx.save()
      ctx.fillStyle = '#0d0d0d'; ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.lineWidth = 1
      ctx.fillRect(pX, y + vH - 10, pW, 4); ctx.strokeRect(pX, y + vH - 10, pW, 4)
      ctx.restore()

      // edge
      ctx.save()
      const eG = ctx.createLinearGradient(0, y, 0, y + vH)
      eG.addColorStop(0, 'rgba(255,255,255,0.16)'); eG.addColorStop(0.5, 'rgba(255,255,255,0.05)'); eG.addColorStop(1, 'transparent')
      ctx.fillStyle = eG
      ctx.fillRect(flip ? x + dW - 2 : x, y + r, 2, vH - r * 2)
      ctx.restore()

      // particles
      for (let i = 0; i < 10; i++) {
        const a = rot * 1.4 + i * (Math.PI * 2 / 10)
        const pr = 70 + Math.sin(rot * 2 + i) * 18
        const px = cx + Math.cos(a) * pr
        const py = cy + Math.sin(a) * pr * 0.22
        const alpha = ((Math.sin(rot * 2 + i * 0.7) + 1) / 2) * 0.45
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
    return () => { cancelAnimationFrame(frameRef.current); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
}

export default function HomePage() {
  const [activePlanet, setActivePlanet] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
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

  return (
    <div style={{ background: '#060608', minHeight: '100vh', color: 'white', fontFamily: 'monospace', overflowX: 'hidden' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; }
        button { cursor: pointer; font-family: monospace; }
        .nav-links { display: flex; gap: 32px; align-items: center; }
        .hamburger { display: none; }
        .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; align-items: center; }
        .vape-col { height: 560px; }
        .strains-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px; }
        .product-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .mission-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; }
        .section-pad { padding: 100px 64px; }
        .planet-card { display: flex; flex-direction: column; padding: 28px 22px; border: 1px solid rgba(255,255,255,0.08); transition: border-color 0.2s, background 0.2s; }
        .planet-card:hover { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.03) !important; }
        @media (max-width: 900px) {
          .nav-links { display: none; }
          .hamburger { display: flex; flex-direction: column; gap: 5px; background: none; border: none; padding: 8px; }
          .hamburger span { display: block; width: 22px; height: 2px; background: rgba(255,255,255,0.7); }
          .mobile-menu { position: fixed; top: 56px; left: 0; right: 0; background: rgba(6,6,8,0.98); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 24px 32px; z-index: 99; display: flex; flex-direction: column; gap: 20px; }
          .mobile-menu a { font-size: 14px; letter-spacing: 0.18em; color: rgba(255,255,255,0.6); }
          .hero-grid { grid-template-columns: 1fr; padding: 80px 24px 40px; }
          .vape-col { height: 320px; order: -1; }
          .strains-grid { grid-template-columns: 1fr 1fr; }
          .product-grid { grid-template-columns: 1fr; gap: 40px; }
          .mission-steps { grid-template-columns: 1fr 1fr; }
          .section-pad { padding: 64px 24px; }
        }
        @media (max-width: 480px) {
          .strains-grid { grid-template-columns: 1fr; }
          .mission-steps { grid-template-columns: 1fr; }
          .hero-grid { padding: 80px 20px 32px; }
          .section-pad { padding: 48px 20px; }
          .planet-card { padding: 20px 16px; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: '56px',
        background: scrollY > 40 ? 'rgba(6,6,8,0.96)' : 'transparent',
        backdropFilter: scrollY > 40 ? 'blur(16px)' : 'none',
        borderBottom: scrollY > 40 ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'background 0.4s, border-color 0.4s, backdrop-filter 0.4s',
      }}>
        <span style={{ fontWeight: 900, fontSize: '16px', letterSpacing: '0.18em', flexShrink: 0 }}>
          OVERRIDE<sup style={{ fontSize: '7px', opacity: 0.35 }}>™</sup>
        </span>

        {/* desktop links */}
        <div className="nav-links">
          {['STRAINS', 'PRODUCT', 'MISSION'].map(n => (
            <a key={n} href={`#${n.toLowerCase()}`} onClick={() => setMenuOpen(false)} style={{
              fontSize: '11px', letterSpacing: '0.18em',
              color: 'rgba(255,255,255,0.38)',
            }}>{n}</a>
          ))}
          <Link href="/mission" style={{
            fontSize: '11px', letterSpacing: '0.15em', color: '#060608',
            background: 'white', padding: '9px 20px', fontWeight: 700, whiteSpace: 'nowrap',
          }}>SCAN →</Link>
        </div>

        {/* mobile hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : 'none', transition: '0.2s' }} />
          <span style={{ opacity: menuOpen ? 0 : 1, transition: '0.2s' }} />
          <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none', transition: '0.2s' }} />
        </button>
      </nav>

      {/* mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {['STRAINS', 'PRODUCT', 'MISSION'].map(n => (
            <a key={n} href={`#${n.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{n}</a>
          ))}
          <Link href="/mission" onClick={() => setMenuOpen(false)} style={{
            fontSize: '12px', letterSpacing: '0.15em', color: '#060608',
            background: 'white', padding: '12px 20px', fontWeight: 700, textAlign: 'center',
          }}>SCAN PRODUCT →</Link>
        </div>
      )}

      {/* HERO */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 65% 65% at ${54 + mouseX * 4}% ${46 + mouseY * 4}%, ${p.color}14 0%, transparent 65%)`,
        transition: 'background 0.9s cubic-bezier(0.4,0,0.2,1)',
      }} />

      {/* stars */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        {[...Array(70)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${(i * 137.5) % 100}%`, top: `${(i * 97.3) % 100}%`,
            width: i % 6 === 0 ? '2px' : '1px', height: i % 6 === 0 ? '2px' : '1px',
            background: 'white', borderRadius: '50%',
            opacity: 0.06 + (i % 7) * 0.04,
          }} />
        ))}
      </div>

      <section style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div className="hero-grid" style={{ minHeight: '100vh', padding: '80px 64px 40px' }}>

          {/* LEFT */}
          <div style={{ transform: `translateY(${-scrollY * 0.15}px)` }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.32em', color: 'rgba(255,255,255,0.25)', marginBottom: '20px' }}>
              SPACESHIP STRAINS™ · LOS ANGELES · CA · 2026
            </p>
            <h1 style={{
              fontSize: 'clamp(64px, 10vw, 128px)', fontWeight: 900,
              letterSpacing: '-0.03em', lineHeight: 0.9, marginBottom: '18px',
              textShadow: `0 0 80px ${p.color}28`, transition: 'text-shadow 0.8s',
            }}>
              OVER<br />RIDE
            </h1>
            <p style={{ fontSize: '13px', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.28)', marginBottom: '40px' }}>
              OVERRIDE THE UNIVERSE
            </p>

            {/* planet card */}
            <div style={{
              border: `1px solid ${p.color}35`, background: `${p.color}0b`,
              padding: '20px 22px', marginBottom: '24px',
              transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <span style={{ fontSize: '26px' }}>{p.emoji}</span>
                <div>
                  <span style={{ fontSize: '20px', fontWeight: 900, color: p.color, letterSpacing: '0.08em' }}>{p.name}</span>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.32)', marginLeft: '10px', letterSpacing: '0.1em' }}>
                    {p.class} · {p.thc} THC
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', lineHeight: 1.65 }}>{p.desc}</p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {p.tags.map(t => (
                  <span key={t} style={{
                    fontSize: '10px', letterSpacing: '0.08em', padding: '3px 9px',
                    border: `1px solid ${p.color}28`, color: p.color, opacity: 0.75,
                  }}>{t}</span>
                ))}
              </div>
            </div>

            {/* planet pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '32px' }}>
              {PLANETS.map((pl, i) => (
                <button key={pl.key} onClick={() => setActivePlanet(i)} style={{
                  padding: '7px 13px',
                  border: `1px solid ${i === activePlanet ? pl.color : 'rgba(255,255,255,0.1)'}`,
                  background: i === activePlanet ? `${pl.color}18` : 'transparent',
                  color: i === activePlanet ? pl.color : 'rgba(255,255,255,0.32)',
                  fontSize: '11px', letterSpacing: '0.1em',
                  transition: 'all 0.22s',
                }}>
                  {pl.emoji} {pl.name}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link href={`/mission?planet=${p.key}`} style={{
                padding: '13px 28px', background: p.color, color: '#060608',
                fontSize: '12px', letterSpacing: '0.14em', fontWeight: 700,
                transition: 'opacity 0.2s',
              }}>
                SCAN {p.name} →
              </Link>
              <a href="#strains" style={{
                padding: '13px 22px', border: '1px solid rgba(255,255,255,0.14)',
                color: 'rgba(255,255,255,0.42)', fontSize: '12px', letterSpacing: '0.12em',
              }}>
                ALL PLANETS
              </a>
            </div>
          </div>

          {/* RIGHT — vape */}
          <div className="vape-col" style={{
            transform: `translateY(${-scrollY * 0.22}px) rotateY(${mouseX * 3}deg) rotateX(${-mouseY * 1.5}deg)`,
            transition: 'transform 0.08s linear',
            perspective: '800px',
          }}>
            <VapeCanvas color={p.color} />
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <p style={{ fontSize: '10px', letterSpacing: '0.26em', color: 'rgba(255,255,255,0.18)' }}>
                OVERRIDE™ · 1.0G · PREMIUM DISTILLATE
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMPLIANCE STRIP */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '18px 24px', position: 'relative', zIndex: 2, overflow: 'hidden',
      }}>
        {/* subtle glow line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
        }} />
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          flexWrap: 'wrap', gap: '8px 32px',
        }}>
          {[
            'LAB TESTED',
            'STATE LICENSED',
            'SCHEDULE III COMPLIANT',
            'CALIFORNIA DISPENSARIES ONLY',
            '21+ ONLY',
          ].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '16px', height: '16px', borderRadius: '50%',
                border: '1px solid rgba(80,255,128,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '9px', color: 'rgba(80,255,128,0.8)', flexShrink: 0,
              }}>✓</span>
              <span style={{
                fontSize: '11px', letterSpacing: '0.18em',
                color: 'rgba(255,255,255,0.55)', fontWeight: 500,
              }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TESTING */}
      <section style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.01)',
        position: 'relative', zIndex: 2,
      }}>
        <div className="section-pad" style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }} className="product-grid">
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.24)', marginBottom: '12px' }}>
                // LAB TESTING
              </p>
              <h2 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '16px', lineHeight: 1.1 }}>
                FULL COA TESTING<br />EVERY BATCH
              </h2>
              <p style={{ fontSize: '14px', lineHeight: 1.85, color: 'rgba(255,255,255,0.4)', marginBottom: '28px' }}>
                Every OVERRIDE product is tested by a licensed California laboratory before it reaches a dispensary shelf. Full Certificate of Analysis — including terpene profile — on every single batch. No exceptions.
              </p>
              <div style={{ padding: '20px 24px', border: '1px solid rgba(80,255,128,0.15)', background: 'rgba(80,255,128,0.04)', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(80,255,128,0.8)', flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(80,255,128,0.9)' }}>MOST POPULAR PACKAGE — FULL COA WITH TERPENES</span>
                </div>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.75 }}>
                  Potency · Pesticides · Microbial · Heavy Metals · Residual Solvents · Foreign Material · Water Activity · <strong style={{ color: 'rgba(255,255,255,0.65)' }}>Full Terpene Profile</strong>
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ padding: '16px 24px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
                  <p style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 4px' }}>$420</p>
                  <p style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)' }}>FULL COA + TERPS</p>
                </div>
                <div style={{ padding: '16px 24px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
                  <p style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 4px' }}>3–5</p>
                  <p style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)' }}>DAY TURNAROUND</p>
                </div>
                <div style={{ padding: '16px 24px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
                  <p style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 4px' }}>CA</p>
                  <p style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)' }}>DCC LICENSED LAB</p>
                </div>
              </div>
            </div>

            {/* test breakdown */}
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.24)', marginBottom: '16px' }}>WHAT'S TESTED</p>
              {[
                { test: 'Potency (Cannabinoids)', price: '$65', desc: 'THC, CBD, and full cannabinoid panel' },
                { test: 'Terpenes', price: '$100', desc: 'Full aromatic and flavor profile' },
                { test: 'Pesticides + Mycotoxins', price: '$150', desc: 'Safety and compliance screening' },
                { test: 'Heavy Metals', price: '$150', desc: 'Lead, cadmium, arsenic, mercury' },
                { test: 'Microbial', price: '$125', desc: 'Bacteria, mold, yeast screening' },
                { test: 'Residual Solvents', price: '$125', desc: 'Extraction solvent residue testing' },
                { test: 'Foreign Material', price: '$25', desc: 'Physical contamination check' },
                { test: 'Water Activity', price: '$25', desc: 'Moisture and stability analysis' },
              ].map(item => (
                <div key={item.test} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '10px 0',
                }}>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 500, marginBottom: '2px', letterSpacing: '0.04em' }}>{item.test}</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)' }}>{item.desc}</p>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', flexShrink: 0, marginLeft: '16px' }}>{item.price}</span>
                </div>
              ))}
              <div style={{ marginTop: '16px', padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '2px' }}>CALIFORNIA LICENSED LABORATORY</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)' }}>Licensed · California DCC Compliant · ISO/IEC 17025</p>
                </div>
                <span style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(80,255,128,0.6)' }}>✓ VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STRAINS */}
      <section id="strains" className="section-pad" style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ marginBottom: '56px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.24)', marginBottom: '12px' }}>
            // FIVE PLANETS · FIVE EXPERIENCES
          </p>
          <h2 style={{ fontSize: 'clamp(32px, 6vw, 60px)', fontWeight: 900, letterSpacing: '-0.02em' }}>
            SELECT YOUR ORBIT
          </h2>
        </div>

        <div className="strains-grid">
          {PLANETS.map((pl, i) => (
            <Link key={pl.key} href={`/mission?planet=${pl.key}`}
              className="planet-card"
              onMouseEnter={() => setActivePlanet(i)}
              style={{ background: `${pl.color}07`, borderColor: `${pl.color}20`, color: 'white' }}>
              <span style={{ fontSize: '36px', marginBottom: '14px', display: 'block' }}>{pl.emoji}</span>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: pl.color, marginBottom: '4px', letterSpacing: '0.06em' }}>{pl.name}</h3>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', marginBottom: '12px', letterSpacing: '0.1em' }}>
                {pl.class} · {pl.thc}
              </p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.38)', marginBottom: '16px', lineHeight: 1.65, flex: 1 }}>
                {pl.desc}
              </p>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '18px' }}>
                {pl.tags.map(t => (
                  <span key={t} style={{
                    fontSize: '9px', letterSpacing: '0.07em', padding: '3px 7px',
                    border: `1px solid ${pl.color}28`, color: pl.color, opacity: 0.7,
                  }}>{t}</span>
                ))}
              </div>
              {/* aligned scan link */}
              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: `1px solid ${pl.color}20` }}>
                <span style={{ fontSize: '11px', letterSpacing: '0.14em', color: pl.color }}>
                  SCAN →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PRODUCT */}
      <section id="product" style={{
        background: 'rgba(255,255,255,0.015)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        position: 'relative', zIndex: 2,
      }}>
        <div className="section-pad product-grid" style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.24)', marginBottom: '14px' }}>// THE DEVICE</p>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '22px', lineHeight: 1.1 }}>
              OVERRIDE<br />VAPE PEN
            </h2>
            <p style={{ fontSize: '14px', lineHeight: 1.85, color: 'rgba(255,255,255,0.4)', marginBottom: '32px' }}>
              Compact all-in-one disposable. Premium hardware engineered for maximum performance. Inhale activated, no setup required. Scan, activate, orbit.
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
                borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '11px 0', fontSize: '12px',
              }}>
                <span style={{ letterSpacing: '0.16em', color: 'rgba(255,255,255,0.28)' }}>{label}</span>
                <span style={{ color: 'rgba(255,255,255,0.68)', fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{ height: '500px', minHeight: '300px' }}>
            <VapeCanvas color={p.color} />
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section id="mission" className="section-pad" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.24)', marginBottom: '14px' }}>
          // DIGITAL MANIFEST SYSTEM
        </p>
        <h2 style={{ fontSize: 'clamp(28px, 6vw, 52px)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '20px' }}>
          MISSION BRIEFING
        </h2>
        <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'rgba(255,255,255,0.36)', marginBottom: '48px', maxWidth: '540px', marginLeft: 'auto', marginRight: 'auto' }}>
          Every OVERRIDE product includes a QR code. Scan to receive your personal boarding pass, unlock your planet, and track your orbit across California dispensaries.
        </p>
        <div className="mission-steps" style={{ marginBottom: '48px', textAlign: 'left' }}>
          {[
            { n: '01', label: 'SCAN', desc: 'QR code on every product' },
            { n: '02', label: 'BOARD', desc: 'Receive your boarding pass' },
            { n: '03', label: 'ORBIT', desc: 'Track your planet journey' },
            { n: '04', label: 'UNLOCK', desc: 'Earn Paradise access' },
          ].map(s => (
            <div key={s.label} style={{
              padding: '22px 20px', border: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(255,255,255,0.02)',
            }}>
              <p style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.2)', marginBottom: '10px' }}>{s.n}</p>
              <p style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.1em' }}>{s.label}</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.32)', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
        <Link href="/mission" style={{
          display: 'inline-block', padding: '15px 48px',
          background: 'white', color: '#060608',
          fontSize: '12px', letterSpacing: '0.2em', fontWeight: 700,
        }}>
          BEGIN MISSION BRIEFING →
        </Link>
      </section>

      {/* COMING SOON */}
      <section style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.01)',
        position: 'relative', zIndex: 2,
      }}>
        <div className="section-pad" style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.24)', marginBottom: '12px' }}>
            // EXPANDING THE ORBIT
          </p>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '12px' }}>
            COMING SOON
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', marginBottom: '48px', lineHeight: 1.7, maxWidth: '500px' }}>
            OVERRIDE is expanding beyond vapes. More formats, same five planets, same mission.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2px' }}>
            {[
              { label: 'LIVE RESIN VAPES', icon: '🔥', status: 'Coming Soon' },
              { label: 'ROSIN VAPES', icon: '💎', status: 'Coming Soon' },
              { label: 'FLOWER', icon: '🌿', status: 'Coming Soon' },
              { label: 'GUMMIES', icon: '🍬', status: 'Coming Soon' },
              { label: 'PRE-ROLLS', icon: '🌀', status: 'Coming Soon' },
            ].map(item => (
              <div key={item.label} style={{
                padding: '28px 20px',
                border: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(255,255,255,0.02)',
                textAlign: 'center',
              }}>
                <span style={{ fontSize: '32px', display: 'block', marginBottom: '14px', opacity: 0.5 }}>{item.icon}</span>
                <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>
                  {item.label}
                </p>
                <span style={{
                  fontSize: '10px', letterSpacing: '0.12em', padding: '3px 10px',
                  border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)',
                }}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FIND IN DISPENSARIES */}
      <section id="dispensaries" style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        position: 'relative', zIndex: 2,
      }}>
        <div className="section-pad" style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.24)', marginBottom: '12px' }}>
            // WHERE TO FIND US
          </p>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '16px' }}>
            FIND IN CALIFORNIA DISPENSARIES
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.35)', marginBottom: '48px', lineHeight: 1.8, maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto' }}>
            OVERRIDE is available at licensed California dispensaries. Scan the QR code on any product to activate your boarding pass and find retailers near you.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2px', marginBottom: '48px', textAlign: 'left' }}>
            {[
              { city: 'LOS ANGELES', detail: 'Greater LA Area' },
              { city: 'LONG BEACH', detail: 'Coming Soon' },
              { city: 'WEST HOLLYWOOD', detail: 'Coming Soon' },
              { city: 'SANTA MONICA', detail: 'Coming Soon' },
            ].map(loc => (
              <div key={loc.city} style={{
                padding: '24px 20px',
                border: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(255,255,255,0.02)',
              }}>
                <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '6px' }}>{loc.city}</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>{loc.detail}</p>
              </div>
            ))}
          </div>
          <Link href="/mission" style={{
            display: 'inline-block', padding: '13px 36px',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.6)', fontSize: '12px', letterSpacing: '0.18em',
          }}>
            SCAN TO LOCATE PRODUCT →
          </Link>
        </div>
      </section>

      {/* STOCK OUR PRODUCTS — B2B */}
      <section style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.015)',
        position: 'relative', zIndex: 2,
      }}>
        <div className="section-pad" style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }} className="product-grid">
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.24)', marginBottom: '12px' }}>
                // FOR DISPENSARY OWNERS
              </p>
              <h2 style={{ fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '20px', lineHeight: 1.1 }}>
                OWN A DISPENSARY<br />IN CALIFORNIA?
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'rgba(255,255,255,0.4)', marginBottom: '32px' }}>
                Stock OVERRIDE on your shelves. We use FundCanna as our business financing partner — so there are no payment disputes, no net terms headaches, and no friction in our relationship.
              </p>
              <div style={{ marginBottom: '32px' }}>
                {[
                  { label: 'PAYMENT', value: 'COD — Cash on Delivery' },
                  { label: 'TERMS OPTION', value: 'Net terms available at +5%' },
                  { label: 'FINANCING', value: 'FundCanna — 24hr approvals' },
                  { label: 'DISTRIBUTION', value: 'Licensed California distributor' },
                  { label: 'COMPLIANCE', value: 'COA verified every batch' },
                ].map((item) => (
                  <div key={item.label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '11px 0', fontSize: '12px',
                  }}>
                    <span style={{ letterSpacing: '0.16em', color: 'rgba(255,255,255,0.28)' }}>{item.label}</span>
                    <span style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: '20px 24px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', marginBottom: '28px' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '8px' }}>HOW IT WORKS</p>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.75 }}>
                  Apply to FundCanna at fundcanna.com. Get approved in as little as 24 hours. When you order OVERRIDE, FundCanna pays us directly — you receive funds within a day of approval. You repay FundCanna on flexible terms. No payment disputes between us. Clean business on both sides.
                </p>
              </div>
              <a href="mailto:rentdigits@gmail.com" style={{
                display: 'inline-block', padding: '14px 36px',
                background: 'white', color: '#060608',
                fontSize: '12px', letterSpacing: '0.18em', fontWeight: 700,
              }}>
                CONTACT US TO STOCK OVERRIDE →
              </a>
            </div>

            {/* right side visual */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {[
                { n: '01', title: 'APPLY TO FUNDCANNA', desc: 'Submit your application at fundcanna.com. Approvals in as little as 24 hours.' },
                { n: '02', title: 'GET APPROVED', desc: 'Receive flexible financing for your OVERRIDE inventory order.' },
                { n: '03', title: 'PLACE YOUR ORDER', desc: 'Order OVERRIDE products. COD standard — net terms available at +5%.' },
                { n: '04', title: 'STOCK YOUR SHELVES', desc: 'Product delivered through our licensed California distributor. No hassle.' },
              ].map(step => (
                <div key={step.n} style={{
                  padding: '20px 22px',
                  border: '1px solid rgba(255,255,255,0.07)',
                  background: 'rgba(255,255,255,0.02)',
                  display: 'flex', gap: '16px', alignItems: 'flex-start',
                }}>
                  <span style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', flexShrink: 0, paddingTop: '3px' }}>{step.n}</span>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '6px' }}>{step.title}</p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.65 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '40px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 2,
      }}>
        <div>
          <p style={{ fontWeight: 900, fontSize: '14px', letterSpacing: '0.18em', marginBottom: '6px' }}>
            OVERRIDE<sup style={{ fontSize: '7px', opacity: 0.35 }}>™</sup>
          </p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
            BY SPACESHIP STRAINS™ · LOS ANGELES · © 2026
          </p>
        </div>
        <p style={{
          fontSize: '11px', color: 'rgba(255,255,255,0.14)',
          maxWidth: '400px', lineHeight: 1.8, textAlign: 'right',
        }}>
          For use by individuals 21 years of age or older only. Available at licensed California dispensaries. Keep out of reach of children.
        </p>
      </footer>

    </div>
  )
}