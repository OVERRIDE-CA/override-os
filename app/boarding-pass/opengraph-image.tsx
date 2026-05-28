import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'
export const alt = 'OVERRIDE™ Boarding Pass — SpaceShip Strains'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const PLANET_COLORS: Record<string, { accent: string; bg: string }> = {
  mars:     { accent: '#ff4820', bg: '#1a0800' },
  jupiter:  { accent: '#f0b428', bg: '#1a1000' },
  saturn:   { accent: '#c4a84a', bg: '#141008' },
  venus:    { accent: '#ff64b4', bg: '#1a0812' },
  neptune:  { accent: '#4060ff', bg: '#08081a' },
  moonrock: { accent: '#b464ff', bg: '#100818' },
}

const PLANET_NAMES: Record<string, string> = {
  mars: 'MARS', jupiter: 'JUPITER', saturn: 'SATURN',
  venus: 'VENUS', neptune: 'NEPTUNE', moonrock: 'REST STATION',
}

const PLANET_EMOJIS: Record<string, string> = {
  mars: '🔴', jupiter: '🟡', saturn: '🪐',
  venus: '✨', neptune: '🌊', moonrock: '🌙',
}

const PLANET_SHORT: Record<string, string> = {
  mars: 'MARS', jupiter: 'JUP', saturn: 'SAT',
  venus: 'VEN', neptune: 'NEP', moonrock: 'REST',
}

const LEVEL_DISPLAY: Record<string, string> = {
  NEW_RECRUIT: 'NEW RECRUIT — ECONOMY',
  CREW_MEMBER: 'CREW MEMBER — BUSINESS',
  INNER_CIRCLE: 'INNER CIRCLE — FIRST CLASS',
  FIRST_CONTACT: 'FIRST CONTACT — PRIVATE CHARTER',
}

const PLANET_CODES: Record<string, string> = {
  mars: 'SS-MAR', jupiter: 'SS-JUP', saturn: 'SS-SAT',
  venus: 'SS-VEN', neptune: 'SS-NEP', moonrock: 'SS-MR',
}

export default async function OGImage({
  searchParams,
}: {
  params: Record<string, string>
  searchParams: Record<string, string>
}) {
  const id = searchParams?.id
  const cpParam = searchParams?.cp
  let name = (searchParams?.name || 'CREW').toUpperCase()
  let planet = cpParam || searchParams?.planet || 'mars'
  let level = 'NEW_RECRUIT'
  let flightCode = 'SS-MAR-0001'
  let scanCount = 1

  if (id) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data } = await supabase.from('users').select('*').eq('id', id).single()
      if (data) {
        name = data.name.toUpperCase()
        planet = cpParam || data.planet || planet
        level = data.level || level
        flightCode = `${PLANET_CODES[planet]}-${id.slice(-4).toUpperCase()}`
        scanCount = data.scan_count || 1
      }
    } catch {}
  }

  const pc = PLANET_COLORS[planet] || PLANET_COLORS.mars
  const planetName = PLANET_NAMES[planet] || 'MARS'
  const planetEmoji = PLANET_EMOJIS[planet] || '🔴'
  const planetShort = PLANET_SHORT[planet] || 'MARS'
  const levelDisplay = LEVEL_DISPLAY[level] || 'NEW RECRUIT — ECONOMY'

  return new ImageResponse(
    (
      <div style={{
        width: '1200px', height: '630px',
        background: `linear-gradient(135deg, #060608 0%, ${pc.bg} 60%, #060608 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'monospace', position: 'relative', overflow: 'hidden',
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: `radial-gradient(circle, ${pc.accent}30 0%, transparent 70%)`,
          filter: 'blur(50px)',
        }} />

        {/* Planet emoji large */}
        <div style={{
          position: 'absolute', right: '-30px', top: '50%',
          transform: 'translateY(-50%)', fontSize: '300px', opacity: 0.07,
          lineHeight: 1, filter: 'blur(2px)',
        }}>
          {planetEmoji}
        </div>

        {/* Scanlines */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.06) 3px,rgba(0,0,0,0.06) 6px)',
        }} />

        {/* BOARDING PASS CARD */}
        <div style={{
          width: '880px', position: 'relative',
          background: 'linear-gradient(160deg, rgba(8,8,18,0.99), rgba(14,8,28,0.99))',
          border: `1px solid ${pc.accent}35`, borderRadius: '20px',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
          boxShadow: `0 0 100px ${pc.accent}20, 0 40px 80px rgba(0,0,0,0.7)`,
        }}>
          {/* Color band */}
          <div style={{ height: '6px', width: '100%', background: `linear-gradient(90deg, ${pc.accent}, ${pc.accent}60)` }} />

          {/* TOP */}
          <div style={{ padding: '32px 44px 28px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <p style={{ margin: 0, fontSize: '22px', fontWeight: 900, letterSpacing: '0.18em', color: 'white' }}>OVERRIDE™</p>
                <p style={{ margin: 0, fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>SPACESHIP STRAINS™</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                <span style={{ fontSize: '10px', letterSpacing: '0.25em', color: pc.accent, border: `1px solid ${pc.accent}40`, padding: '5px 12px', textTransform: 'uppercase' }}>
                  BOARDING PASS
                </span>
                <span style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(80,255,128,0.7)', textTransform: 'uppercase' }}>
                  ● LAUNCH AUTHORIZED
                </span>
              </div>
            </div>

            {/* Route */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <p style={{ margin: 0, fontSize: '56px', fontWeight: 900, color: 'white', letterSpacing: '-0.02em', lineHeight: 1 }}>LAX</p>
                <p style={{ margin: 0, fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>LOS ANGELES</p>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '0 10px' }}>
                <span style={{ fontSize: '24px', color: 'rgba(255,255,255,0.3)' }}>✈</span>
                <div style={{ width: '100%', height: '1px', background: `linear-gradient(90deg, rgba(255,255,255,0.1), ${pc.accent}40, rgba(255,255,255,0.1))` }} />
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>{flightCode}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <p style={{ margin: 0, fontSize: '48px', fontWeight: 900, color: pc.accent, letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {planetShort}
                </p>
                <p style={{ margin: 0, fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>{planetName}</p>
              </div>
            </div>
          </div>

          {/* DETAILS */}
          <div style={{ padding: '24px 44px', display: 'flex', gap: '0', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '48px', flex: 1 }}>
              {[
                { label: 'PASSENGER', value: name, large: true },
                { label: 'MISSION', value: `${scanCount} of ∞`, color: pc.accent },
                { label: 'CLASS', value: levelDisplay, color: pc.accent, small: true },
              ].map(({ label, value, large, color, small }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: large ? 2 : 1 }}>
                  <p style={{ margin: 0, fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>{label}</p>
                  <p style={{ margin: 0, fontSize: small ? '13px' : large ? '20px' : '16px', fontWeight: 800, color: color || 'white', letterSpacing: '0.04em', lineHeight: 1.2 }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom brand */}
        <div style={{
          position: 'absolute', bottom: '18px', left: 0, right: 0,
          textAlign: 'center', fontSize: '10px', letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.12)', textTransform: 'uppercase',
        }}>
          OVERRIDE™ · MISSION BRIEFING™ · SPACESHIP STRAINS™ · LOS ANGELES · 2026
        </div>
      </div>
    ),
    { ...size }
  )
}