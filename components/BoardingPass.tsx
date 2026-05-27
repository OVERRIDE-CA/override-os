'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  getUserById,
  PLANET_COLORS,
  PLANET_NAMES,
  PLANET_CODES,
  ROUTING,
  LEVEL_DISPLAY,
} from '@/lib/supabase'

const PLANET_PORT_CODES: Record<string, string> = {
  mars:     'MRS',
  jupiter:  'JUP',
  saturn:   'SAT',
  venus:    'VEN',
  neptune:  'NEP',
  moonrock: 'MR ',
}

interface PassData {
  id: string
  name: string
  planet: string
  intensity: string
  recommendation: string
  level: string
  status: string
  created_at: string
  email?: string
}

interface OfflinePassData {
  name: string
  planet: string
  intensity: string
  level: string
}

export default function BoardingPassClient({
  userId,
  offlineData,
}: {
  userId?: string
  offlineData?: OfflinePassData
}) {
  const router = useRouter()
  const [pass, setPass] = useState<PassData | null>(null)
  const [loading, setLoading] = useState(true)
  const [stars, setStars] = useState<Array<{ x: number; y: number; r: number; o: number }>>([])

  // Stars
  useEffect(() => {
    setStars(Array.from({ length: 140 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: Math.random() * 1.1 + 0.2,
      o: Math.random() * 0.5 + 0.1,
    })))
  }, [])

  // Load pass from Supabase
  useEffect(() => {
    async function load() {
      if (userId) {
        try {
          const data = await getUserById(userId)
          setPass(data)
        } catch {
          // Fall back to offline if Supabase fails
          if (offlineData) {
            setPass({
              id: 'offline',
              name: offlineData.name,
              planet: offlineData.planet,
              intensity: offlineData.intensity,
              recommendation: ROUTING[offlineData.planet]?.[offlineData.intensity]?.key || 'jupiter',
              level: offlineData.level || 'NEW_RECRUIT',
              status: 'LAUNCHED',
              created_at: new Date().toISOString(),
            })
          }
        }
      } else if (offlineData) {
        setPass({
          id: 'offline',
          name: offlineData.name,
          planet: offlineData.planet,
          intensity: offlineData.intensity,
          recommendation: ROUTING[offlineData.planet]?.[offlineData.intensity]?.key || 'jupiter',
          level: offlineData.level || 'NEW_RECRUIT',
          status: 'LAUNCHED',
          created_at: new Date().toISOString(),
        })
      }
      setLoading(false)
    }
    load()
  }, [userId, offlineData])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-4xl animate-bounce">🚀</div>
          <p className="text-[0.48rem] tracking-[0.25em] uppercase text-white/30">LOADING PASS...</p>
        </div>
      </div>
    )
  }

  if (!pass) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center px-6">
        <div className="max-w-[400px] w-full text-center flex flex-col gap-6">
          <h2 className="font-display font-extrabold text-2xl text-white/50">NO PASS FOUND</h2>
          <p className="text-[0.52rem] tracking-[0.1em] uppercase text-white/20 leading-relaxed">
            Complete a Mission Briefing scan to receive your boarding pass.
          </p>
          <button onClick={() => router.push('/mission')}
            className="w-full py-4 text-[0.6rem] tracking-[0.18em] uppercase font-mono text-white"
            style={{ background: 'linear-gradient(135deg, rgba(0,40,120,0.9), rgba(50,0,100,0.9))', border: '1px solid rgba(0,212,255,0.3)' }}>
            BEGIN MISSION BRIEFING →
          </button>
        </div>
      </div>
    )
  }

  const planet = pass.planet || 'jupiter'
  const pc = PLANET_COLORS[planet] || PLANET_COLORS.jupiter
  const rec = ROUTING[planet]?.[pass.intensity || 'perfect']
  const recPlanet = pass.recommendation || rec?.key || 'jupiter'
  const recData = Object.values(ROUTING[planet] || {}).find(r => r.key === recPlanet) || rec
  const portCode = PLANET_PORT_CODES[planet] || '???'
  const flightCode = `${PLANET_CODES[planet] || 'SS-???'}-${pass.id.slice(-4).toUpperCase()}`
  const passDate = new Date(pass.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  }).toUpperCase()
  const levelDisplay = LEVEL_DISPLAY[pass.level] || 'NEW RECRUIT — ECONOMY'
  const seatLetter = String.fromCharCode(65 + (pass.id.charCodeAt(0) % 6))
  const seatNum = (pass.id.charCodeAt(1) % 30) + 1

  const upgradeMessages: Record<string, string> = {
    NEW_RECRUIT:   'Scan OVERRIDE again to unlock Crew Member — Business Class and get dispensary restock notifications.',
    CREW_MEMBER:   'One more scan to unlock Inner Circle — First Class. Paradise drops 24 hours early.',
    INNER_CIRCLE:  'One more scan to reach First Contact — Private Charter. Paradise 72hrs early.',
    FIRST_CONTACT: 'You are at the top of the orbit. First Contact — Paradise before everyone.',
  }

  return (
    <div className="relative min-h-screen bg-[#060608] overflow-hidden">
      {/* Stars */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {stars.map((s, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r, height: s.r, opacity: s.o }} />
        ))}
      </div>

      {/* Ambient */}
      <div className="fixed inset-0 z-0 pointer-events-none transition-all duration-1000"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 30%, ${pc.glow} 0%, transparent 70%)` }} />

      <div className="relative z-10 flex flex-col items-center px-5 py-8 safe-top safe-bottom">
        <div className="w-full max-w-[440px] flex flex-col items-center gap-4">

          {/* Header */}
          <div className="w-full flex items-center justify-between pb-4 border-b border-white/[0.07]">
            <span className="font-display font-extrabold text-base tracking-[0.2em]">
              OVERRIDE<sup className="text-[0.4em] opacity-40">™</sup>
            </span>
            <span className="text-[0.42rem] tracking-[0.2em] uppercase flex items-center gap-1.5"
              style={{ color: 'rgba(80,255,128,0.8)' }}>
              <span className="w-1.5 h-1.5 rounded-full blink" style={{ background: 'rgba(80,255,128,0.8)', boxShadow: '0 0 5px rgba(80,255,128,0.7)' }} />
              AUTHORIZED
            </span>
          </div>

          {/* Auth badge */}
          <div className="flex items-center gap-2 px-4 py-1.5 border text-[0.48rem] tracking-[0.22em] uppercase"
            style={{ borderColor: 'rgba(80,255,128,0.2)', color: 'rgba(80,255,128,0.85)', background: 'rgba(80,255,128,0.04)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(80,255,128,0.85)' }} />
            LAUNCH AUTHORIZED
          </div>

          <h1 className="font-display font-extrabold text-4xl tracking-[0.08em] text-center text-white leading-none">
            BOARDING<br />PASS ISSUED
          </h1>

          {/* ═══ THE BOARDING PASS ═══ */}
          <div className="w-full relative overflow-hidden rounded-xl"
            style={{
              background: 'linear-gradient(160deg, rgba(8,8,15,0.98), rgba(12,8,25,0.98))',
              border: `1px solid ${pc.accent}30`,
              boxShadow: `0 0 60px ${pc.glow}, 0 20px 60px rgba(0,0,0,0.5)`
            }}>

            {/* Planet glow decoration */}
            <div className="absolute top-[-30px] right-[-30px] w-40 h-40 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, ${pc.glow}, transparent 70%)`, filter: 'blur(25px)' }} />

            {/* TOP — Route */}
            <div className="px-5 py-5 border-b border-white/[0.06] relative">
              {/* Airline row */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-display font-extrabold text-xl tracking-[0.18em] text-white">
                    OVERRIDE<sup className="text-[0.4em] opacity-35">™</sup>
                  </div>
                  <div className="text-[0.38rem] tracking-[0.2em] uppercase text-white/22">SPACESHIP STRAINS™</div>
                </div>
                <div className="text-[0.38rem] tracking-[0.25em] uppercase px-2.5 py-1"
                  style={{ border: `1px solid ${pc.accent}30`, color: `${pc.accent}`, background: 'rgba(0,0,0,0.3)' }}>
                  BOARDING PASS
                </div>
              </div>

              {/* Route */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col items-center gap-1">
                  <span className="font-display font-extrabold text-3xl tracking-[0.06em] text-white">LAX</span>
                  <span className="text-[0.38rem] tracking-[0.15em] uppercase text-white/30">Los Angeles</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-2xl" style={{ display: 'inline-block', animation: 'float 3s ease-in-out infinite', transform: 'rotate(90deg)' }}>✈</span>
                  <div className="w-full h-px" style={{ background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.15) 0, rgba(255,255,255,0.15) 4px, transparent 4px, transparent 8px)' }} />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="font-display font-extrabold text-3xl tracking-[0.06em]" style={{ color: pc.accent }}>
                    {portCode}
                  </span>
                  <span className="text-[0.38rem] tracking-[0.15em] uppercase text-white/30">
                    {PLANET_NAMES[planet]}
                  </span>
                </div>
              </div>
            </div>

            {/* MIDDLE — Details */}
            <div className="px-5 py-4 border-b border-white/[0.05]">
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[0.36rem] tracking-[0.2em] uppercase text-white/22">Passenger</span>
                  <span className="font-display font-bold text-sm tracking-[0.04em] text-white leading-tight">
                    {pass.name.toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[0.36rem] tracking-[0.2em] uppercase text-white/22">Flight</span>
                  <span className="font-display font-bold text-sm tracking-[0.04em] text-white">{flightCode}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[0.36rem] tracking-[0.2em] uppercase text-white/22">Date</span>
                  <span className="font-display font-bold text-xs tracking-[0.03em] text-white">{passDate}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[0.36rem] tracking-[0.2em] uppercase text-white/22">Class</span>
                  <span className="text-[0.55rem] tracking-[0.04em] uppercase text-white font-bold leading-tight">{levelDisplay}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[0.36rem] tracking-[0.2em] uppercase text-white/22">Next Planet</span>
                  <span className="text-[0.6rem] tracking-[0.06em] uppercase font-bold" style={{ color: pc.accent }}>
                    {PLANET_NAMES[recPlanet] || '—'}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[0.36rem] tracking-[0.2em] uppercase text-white/22">Status</span>
                  <span className="text-[0.55rem] tracking-[0.06em] uppercase font-bold" style={{ color: 'rgba(80,255,128,0.8)' }}>
                    {pass.status}
                  </span>
                </div>
              </div>
            </div>

            {/* TEAR LINE */}
            <div className="flex items-center mx-[-1px]">
              <div className="w-3 h-3 rounded-full bg-[#060608] border border-white/10 -ml-1.5 flex-shrink-0" />
              <div className="flex-1 border-t border-dashed border-white/[0.08]" />
              <div className="w-3 h-3 rounded-full bg-[#060608] border border-white/10 -mr-1.5 flex-shrink-0" />
            </div>

            {/* STUB */}
            <div className="px-5 py-4">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[0.36rem] tracking-[0.2em] uppercase text-white/22">Gate</span>
                  <span className="font-display font-bold text-sm text-white">SS-01</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[0.36rem] tracking-[0.2em] uppercase text-white/22">Seat</span>
                  <span className="font-display font-bold text-sm text-white">{seatLetter}{seatNum}</span>
                </div>
              </div>

              {/* Barcode */}
              <div className="flex flex-col gap-1.5">
                <div className="w-full h-11 rounded-sm opacity-[0.12]"
                  style={{ background: 'repeating-linear-gradient(90deg, white 0, white 1.5px, transparent 1.5px, transparent 3px, white 3px, white 4px, transparent 4px, transparent 6px, white 6px, white 7px, transparent 7px, transparent 10px, white 10px, white 12px, transparent 12px, transparent 14px)' }} />
                <p className="text-[0.34rem] tracking-[0.15em] uppercase text-white/18 text-center">
                  OVERRIDE™ · MISSION BRIEFING™ · SPACESHIP STRAINS™
                </p>
              </div>
            </div>
          </div>

          {/* NEXT DESTINATION */}
          {recData && (
            <div className="w-full border border-white/[0.06] bg-white/[0.01] p-4 text-center">
              <span className="text-[0.4rem] tracking-[0.2em] uppercase text-white/22 block mb-2">// NEXT DESTINATION UNLOCKED</span>
              <span className="text-4xl block mb-1.5">{recData.emoji}</span>
              <span className="font-display font-extrabold text-xl tracking-[0.12em] block mb-1.5" style={{ color: pc.accent }}>
                {recData.name}
              </span>
              <span className="text-[0.55rem] text-white/40 leading-relaxed tracking-[0.03em]">{recData.desc}</span>
            </div>
          )}

          {/* UPGRADE MESSAGE */}
          <div className="w-full border border-amber-400/20 bg-amber-400/[0.04] px-4 py-3.5">
            <p className="text-[0.48rem] text-amber-300/60 leading-relaxed tracking-[0.04em]">
              {upgradeMessages[pass.level] || upgradeMessages.NEW_RECRUIT}
            </p>
          </div>

          {/* CTAs */}
          <a href="https://spaceshipstrains.com" className="w-full">
            <button className="w-full py-4 text-[0.6rem] tracking-[0.18em] uppercase font-mono text-white active:opacity-70"
              style={{ background: 'linear-gradient(135deg, rgba(0,40,120,0.9), rgba(50,0,100,0.9))', border: `1px solid ${pc.accent}40` }}>
              EXPLORE ALL PLANETS →
            </button>
          </a>

          <a href="https://instagram.com/spaceshipstrains" target="_blank" rel="noopener" className="w-full">
            <button className="w-full py-3.5 text-[0.58rem] tracking-[0.15em] uppercase font-mono active:opacity-70"
              style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.4)' }}>
              FOLLOW @SPACESHIPSTRAINS
            </button>
          </a>

          <button onClick={() => router.push('/mission')}
            className="w-full py-3.5 text-[0.58rem] tracking-[0.15em] uppercase font-mono active:opacity-70"
            style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.25)' }}>
            SCAN NEW PLANET →
          </button>

          <p className="text-[0.36rem] tracking-[0.18em] uppercase text-white/[0.08] text-center pb-2">
            OVERRIDE™ · SPACESHIP STRAINS™ · MISSION BRIEFING™ · LOS ANGELES · 2026
          </p>

        </div>
      </div>
    </div>
  )
}
