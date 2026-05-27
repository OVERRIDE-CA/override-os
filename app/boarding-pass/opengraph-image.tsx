import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'
export const alt = 'OVERRIDE™ Boarding Pass — SpaceShip Strains'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// #3 Use cp (current planet) param if provided


const PLANET_COLORS: Record<string, { accent: string; glow: string; bg: string }> = {
  mars:     { accent: '#ff4820', glow: '#ff482040', bg: '#1a0800' },
  jupiter:  { accent: '#f0b428', glow: '#f0b42840', bg: '#1a1000' },
  saturn:   { accent: '#c4a84a', glow: '#c4a84a40', bg: '#141008' },
  venus:    { accent: '#ff64b4', glow: '#ff64b440', bg: '#1a0812' },
  neptune:  { accent: '#4060ff', glow: '#4060ff40', bg: '#08081a' },
  moonrock: { accent: '#b464ff', glow: '#b464ff40', bg: '#100818' },
}

const PLANET_NAMES: Record<string, string> = {
  mars: 'MARS', jupiter: 'JUPITER', saturn: 'SATURN',
  venus: 'VENUS', neptune: 'NEPTUNE', moonrock: 'MOON ROCK',
}

const PLANET_EMOJIS: Record<string, string> = {
  mars: '🔴', jupiter: '🟡', saturn: '🪐',
  venus: '✨', neptune: '🌊', moonrock: '🌙',
}

const LEVEL_DISPLAY: Record<string, string> = {
  NEW_RECRUIT:   'NEW RECRUIT — ECONOMY',
  CREW_MEMBER:   'CREW MEMBER — BUSINESS',
  INNER_CIRCLE:  'INNER CIRCLE — FIRST CLASS',
  FIRST_CONTACT: 'FIRST CONTACT — PRIVATE CHARTER',
}

const PLANET_CODES: Record<string, string> = {
  mars: 'SS-MAR', jupiter: 'SS-JUP', saturn: 'SS-SAT',
  venus: 'SS-VEN', neptune: 'SS-NEP', moonrock: 'SS-MR',
}

export default async function OGImage({ params, searchParams }: {
  params: Record<string, string>
  searchParams: Record<string, string>
}) {
  const id = searchParams?.id
  // cp = current session planet (overrides Supabase stored planet)
  const cpParam = searchParams?.cp
  const offlinePlanet = cpParam || searchParams?.planet || 'mars'
  const offlineName = searchParams?.name || 'CREW'

  let name = offlineName.toUpperCase()
  let planet = offlinePlanet
  let level = 'NEW_RECRUIT'
  let flightSuffix = '0001'
  let passDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()

  // Fetch from Supabase if we have an ID
  if (id) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data } = await supabase.from('users').select('*').eq('id', id).single()
      if (data) {
        name = data.name.toUpperCase()
        // Use cp param (current session planet) if provided, else Supabase stored planet
        planet = cpParam || data.planet || planet
        level = data.level || level
        flightSuffix = id.slice(-4).toUpperCase()
        passDate = new Date(data.created_at).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        }).toUpperCase()
      }
    } catch {}
  }

  const pc = PLANET_COLORS[planet] || PLANET_COLORS.mars
  const flightCode = `${PLANET_CODES[planet]}-${flightSuffix}`
  const levelDisplay = LEVEL_DISPLAY[level] || 'NEW RECRUIT — ECONOMY'
  const planetName = PLANET_NAMES[planet] || 'MARS'
  const planetEmoji = PLANET_EMOJIS[planet] || '🔴'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: `linear-gradient(135deg, #060608 0%, ${pc.bg} 50%, #060608 100%)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'monospace',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${pc.glow} 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }} />

        {/* Large faded planet */}
        <div style={{
          position: 'absolute',
          right: '-20px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '320px',
          opacity: 0.08,
          lineHeight: 1,
        }}>
          {planetEmoji}
        </div>

        {/* Scanlines */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 6px)',
          pointerEvents: 'none',
        }} />

        {/* BOARDING PASS CARD */}
        <div style={{
          width: '900px',
          background: 'linear-gradient(160deg, rgba(8,8,15,0.98), rgba(12,8,25,0.98))',
          border: `1px solid ${pc.accent}40`,
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: `0 0 80px ${pc.glow}, 0 30px 80px rgba(0,0,0,0.6)`,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}>

          {/* TOP — Header + Route */}
          <div style={{
            padding: '32px 40px 28px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}>
            {/* Airline row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  letterSpacing: '0.2em',
                  color: 'white',
                  fontFamily: 'sans-serif',
                }}>
                  OVERRIDE™
                </div>
                <div style={{
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.3)',
                }}>
                  SPACESHIP STRAINS™
                </div>
              </div>
              <div style={{
                fontSize: '11px',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                border: `1px solid ${pc.accent}40`,
                color: pc.accent,
                padding: '6px 14px',
                background: 'rgba(0,0,0,0.4)',
              }}>
                BOARDING PASS
              </div>
            </div>

            {/* Route */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ fontSize: '52px', fontWeight: 800, color: 'white', letterSpacing: '0.06em', fontFamily: 'sans-serif' }}>LAX</div>
                <div style={{ fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>Los Angeles</div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ fontSize: '28px', transform: 'rotate(90deg)' }}>✈</div>
                <div style={{
                  width: '100%',
                  height: '1px',
                  backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.2) 0, rgba(255,255,255,0.2) 6px, transparent 6px, transparent 12px)',
                }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ fontSize: '52px', fontWeight: 800, color: pc.accent, letterSpacing: '0.06em', fontFamily: 'sans-serif' }}>
                  {planetName}
                </div>
                <div style={{ fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
                  {planetEmoji} DESTINATION
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM — Details */}
          <div style={{
            padding: '24px 40px',
            display: 'flex',
            gap: '0',
          }}>
            {/* Fields grid */}
            <div style={{ display: 'flex', gap: '40px', flex: 1 }}>
              {[
                { label: 'PASSENGER', value: name },
                { label: 'FLIGHT', value: flightCode },
                { label: 'DATE', value: passDate },
                { label: 'CLASS', value: levelDisplay },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: label === 'CLASS' ? 2 : 1 }}>
                  <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
                    {label}
                  </div>
                  <div style={{
                    fontSize: label === 'CLASS' ? '13px' : '16px',
                    fontWeight: 700,
                    color: label === 'CLASS' ? pc.accent : 'white',
                    letterSpacing: '0.04em',
                    fontFamily: 'sans-serif',
                  }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom brand */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: '11px',
          letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.15)',
          textTransform: 'uppercase',
        }}>
          OVERRIDE™ · MISSION BRIEFING™ · SPACESHIP STRAINS™ · LOS ANGELES · 2026
        </div>

      </div>
    ),
    {
      ...size,
    }
  )
}