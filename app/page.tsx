import Link from 'next/link'

const PLANETS = [
  {
    key: 'mars',
    name: 'MARS',
    class: 'Sativa',
    thc: '32%',
    desc: 'Maximum launch power. Immediate cerebral surge. Proceed with caution.',
    tags: ['Blastoff', 'Heavy Hitter', 'Deep Space'],
    color: '#ff4820',
    bg: 'rgba(255,72,32,0.08)',
    emoji: '🔴',
  },
  {
    key: 'jupiter',
    name: 'JUPITER',
    class: 'Hybrid',
    thc: '28%',
    desc: 'Perfectly balanced atmospheric high. The best entry point for any level.',
    tags: ['Gas Giant', 'Atmospheric', 'Hyper-Balance'],
    color: '#f0b428',
    bg: 'rgba(240,180,40,0.08)',
    emoji: '🟡',
  },
  {
    key: 'saturn',
    name: 'SATURN',
    class: 'Indica',
    thc: '26%',
    desc: 'Heavy, slow-rolling physical descent. Maximum grounding and stability.',
    tags: ['Deep Gravity', 'Ring System', 'Heavy Orbit'],
    color: '#c4a84a',
    bg: 'rgba(196,168,74,0.08)',
    emoji: '🪐',
  },
  {
    key: 'venus',
    name: 'VENUS',
    class: 'Sativa',
    thc: '30%',
    desc: 'Bright, rapid-firing cerebral surge. Built for creative minds.',
    tags: ['Solar Flare', 'Ionic Glow', 'Elevated High'],
    color: '#ff64b4',
    bg: 'rgba(255,100,180,0.08)',
    emoji: '✨',
  },
  {
    key: 'neptune',
    name: 'NEPTUNE',
    class: 'Indica',
    thc: '30%',
    desc: 'Deep, tranquil stabilization. Quiet, endless calm of the outer system.',
    tags: ['Deep Blue', 'Abyssal Class', 'Sub-Orbital'],
    color: '#4060ff',
    bg: 'rgba(64,96,255,0.08)',
    emoji: '🌊',
  },
]

export default function HomePage() {
  return (
    <div style={{ background: '#060608', minHeight: '100vh', color: 'white', fontFamily: 'monospace' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: '56px',
        background: 'rgba(6,6,8,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <span style={{ fontWeight: 900, fontSize: '16px', letterSpacing: '0.15em' }}>
          OVERRIDE<sup style={{ fontSize: '8px', opacity: 0.4 }}>™</sup>
        </span>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="#strains" style={{ fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>STRAINS</a>
          <a href="#mission" style={{ fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>MISSION</a>
          <Link href="/mission" style={{
            fontSize: '11px', letterSpacing: '0.15em', color: '#060608', textDecoration: 'none',
            background: 'white', padding: '8px 16px', fontWeight: 700,
          }}>
            SCAN PRODUCT →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* ambient */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,72,32,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', marginBottom: '24px' }}>
          SPACESHIP STRAINS™ · LOS ANGELES · CALIFORNIA · 2026
        </p>

        <h1 style={{
          fontSize: 'clamp(64px, 18vw, 160px)', fontWeight: 900,
          letterSpacing: '-0.02em', lineHeight: 1, margin: '0 0 8px',
          fontFamily: 'monospace',
        }}>
          OVERRIDE
        </h1>

        <p style={{
          fontSize: 'clamp(13px, 3vw, 18px)', letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.35)', margin: '0 0 48px', textTransform: 'uppercase',
        }}>
          Override the Atmosphere
        </p>

        <p style={{
          fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.5)',
          maxWidth: '520px', margin: '0 0 48px',
        }}>
          Five planets. Five experiences. Premium California cannabis — lab tested, state licensed, Schedule III compliant.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#strains" style={{
            padding: '14px 32px', background: 'white', color: '#060608',
            fontSize: '12px', letterSpacing: '0.15em', fontWeight: 700, textDecoration: 'none',
          }}>
            EXPLORE PLANETS
          </a>
          <Link href="/mission" style={{
            padding: '14px 32px', border: '1px solid rgba(255,255,255,0.2)',
            color: 'white', fontSize: '12px', letterSpacing: '0.15em', textDecoration: 'none',
          }}>
            SCAN PRODUCT →
          </Link>
        </div>

        {/* scroll hint */}
        <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.15)' }}>SCROLL</p>
        </div>
      </section>

      {/* COMPLIANCE STRIP */}
      <div style={{
        background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '16px 24px', textAlign: 'center',
      }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)', margin: 0 }}>
          ✓ LAB TESTED &nbsp;·&nbsp; ✓ STATE LICENSED &nbsp;·&nbsp; ✓ SCHEDULE III COMPLIANT &nbsp;·&nbsp; ✓ AVAILABLE AT LICENSED CALIFORNIA DISPENSARIES
        </p>
      </div>

      {/* STRAINS */}
      <section id="strains" style={{ padding: '100px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ marginBottom: '64px', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', margin: '0 0 16px' }}>
            // PRODUCT LINE
          </p>
          <h2 style={{ fontSize: 'clamp(32px, 8vw, 64px)', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>
            FIVE PLANETS
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2px' }}>
          {PLANETS.map((p) => (
            <Link
              key={p.key}
              href={`/mission?planet=${p.key}`}
              style={{
                display: 'block', textDecoration: 'none', color: 'white',
                background: p.bg, border: `1px solid ${p.color}18`,
                padding: '32px', position: 'relative', overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <p style={{ fontSize: '11px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.3)', margin: '0 0 6px' }}>
                    {p.class.toUpperCase()} · {p.thc} THC
                  </p>
                  <h3 style={{ fontSize: '32px', fontWeight: 900, color: p.color, margin: 0, letterSpacing: '0.04em' }}>
                    {p.name}
                  </h3>
                </div>
                <span style={{ fontSize: '40px', opacity: 0.6 }}>{p.emoji}</span>
              </div>

              <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.45)', margin: '0 0 20px' }}>
                {p.desc}
              </p>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                {p.tags.map(t => (
                  <span key={t} style={{
                    fontSize: '10px', letterSpacing: '0.1em', padding: '4px 10px',
                    border: `1px solid ${p.color}30`, color: p.color, opacity: 0.8,
                  }}>
                    {t}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', letterSpacing: '0.15em', color: p.color }}>
                  SCAN TO ACTIVATE →
                </span>
              </div>

              {/* color bar */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: '2px', background: p.color, opacity: 0.4,
              }} />
            </Link>
          ))}
        </div>
      </section>

      {/* MISSION BRIEFING SECTION */}
      <section id="mission" style={{
        padding: '100px 24px', background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', margin: '0 0 16px' }}>
            // DIGITAL MANIFEST SYSTEM
          </p>
          <h2 style={{ fontSize: 'clamp(28px, 7vw, 56px)', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 24px' }}>
            MISSION BRIEFING™
          </h2>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'rgba(255,255,255,0.45)', margin: '0 0 48px' }}>
            Every OVERRIDE product includes a QR code. Scan it to receive your personal boarding pass, unlock your planet, and track your orbit across California dispensaries.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '48px' }}>
            {[
              { label: 'SCAN', desc: 'QR code on every product' },
              { label: 'BOARD', desc: 'Receive your digital boarding pass' },
              { label: 'ORBIT', desc: 'Track your planet progression' },
              { label: 'UNLOCK', desc: 'Earn Paradise early access' },
            ].map((step, i) => (
              <div key={step.label} style={{
                padding: '24px', border: '1px solid rgba(255,255,255,0.08)',
                textAlign: 'left',
              }}>
                <p style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)', margin: '0 0 8px' }}>
                  0{i + 1}
                </p>
                <p style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px', letterSpacing: '0.1em' }}>
                  {step.label}
                </p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', margin: 0, lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <Link href="/mission" style={{
            display: 'inline-block', padding: '16px 40px',
            background: 'white', color: '#060608',
            fontSize: '12px', letterSpacing: '0.2em', fontWeight: 700, textDecoration: 'none',
          }}>
            BEGIN MISSION BRIEFING →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '48px 24px', textAlign: 'center',
      }}>
        <p style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '0.15em', margin: '0 0 8px' }}>
          OVERRIDE<sup style={{ fontSize: '8px', opacity: 0.4 }}>™</sup>
        </p>
        <p style={{ fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)', margin: '0 0 24px' }}>
          BY SPACESHIP STRAINS™ · LOS ANGELES · CALIFORNIA
        </p>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.15)', margin: '0 0 16px', lineHeight: 1.8, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          For use by individuals 21 years of age or older. Keep out of reach of children. Cannabis products may only be possessed or consumed at licensed premises. State licensed — California DCC compliant.
        </p>
        <p style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.1)', margin: 0 }}>
          © 2026 SPACESHIP STRAINS LLC · ALL RIGHTS RESERVED
        </p>
      </footer>
    </div>
  )
}