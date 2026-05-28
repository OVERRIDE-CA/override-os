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

const PLANET_SHORT: Record<string, string> = {
  mars: 'MARS', jupiter: 'JUP', saturn: 'SAT',
  venus: 'VEN', neptune: 'NEP', moonrock: 'REST',
}

const PLANET_EMOJIS: Record<string, string> = {
  mars: '🔴', jupiter: '🟡', saturn: '🪐',
  venus: '✨', neptune: '🌊', moonrock: '🌙',
}

const PLANET_BG: Record<string, string> = {
  mars:     'radial-gradient(ellipse 120% 80% at 80% 50%, rgba(255,72,32,0.18) 0%, transparent 65%)',
  jupiter:  'radial-gradient(ellipse 120% 80% at 80% 50%, rgba(240,180,40,0.14) 0%, transparent 65%)',
  saturn:   'radial-gradient(ellipse 120% 80% at 80% 50%, rgba(196,168,74,0.14) 0%, transparent 65%)',
  venus:    'radial-gradient(ellipse 120% 80% at 80% 50%, rgba(255,100,180,0.14) 0%, transparent 65%)',
  neptune:  'radial-gradient(ellipse 120% 80% at 80% 50%, rgba(64,96,255,0.18) 0%, transparent 65%)',
  moonrock: 'radial-gradient(ellipse 120% 80% at 80% 50%, rgba(180,100,255,0.18) 0%, transparent 65%)',
}

const CORE_PLANETS = ['mars', 'jupiter', 'saturn', 'venus', 'neptune']

const STATE_DISPLAY: Record<string, { label: string; color: string }> = {
  NEW_USER:              { label: 'NEW USER',           color: 'rgba(0,212,255,0.7)' },
  VERIFIED_USER:         { label: 'VERIFIED',           color: 'rgba(80,255,128,0.8)' },
  FIRST_MISSION_COMPLETE:{ label: 'MISSION COMPLETE',   color: '#f0b428' },
  ORBIT_TIER_1:          { label: 'ORBIT TIER 1',       color: '#ff64b4' },
  ORBIT_TIER_2:          { label: 'ORBIT TIER 2',       color: '#b464ff' },
  PARADISE_ELIGIBLE:     { label: '✦ PARADISE ELIGIBLE',color: '#f0b428' },
}

interface FlightRecord {
  planet: string
  date: string
  intensity: string
}

interface PassData {
  id: string
  name: string
  planet: string
  intensity: string
  recommendation: string
  level: string
  state?: string
  status: string
  created_at: string
  scan_count: number
  streak_count?: number
  home_planet?: string
  referral_code?: string
  referral_count?: number
  paradise_access?: boolean
  flight_history?: FlightRecord[]
  email?: string
}

interface OfflinePassData {
  name: string; planet: string; intensity: string; level: string
}

export default function BoardingPassClient({
  userId, offlineData, currentPlanet, currentIntensity,
}: {
  userId?: string
  offlineData?: OfflinePassData
  currentPlanet?: string
  currentIntensity?: string
}) {
  const router = useRouter()
  const [pass, setPass] = useState<PassData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [stars, setStars] = useState<Array<{ x: number; y: number; r: number; o: number }>>([])
  const [visitedPlanets, setVisitedPlanets] = useState<string[]>([])

  useEffect(() => {
    setStars(Array.from({ length: 120 }, () => ({
      x: Math.random() * 100, y: Math.random() * 100,
      r: Math.random() * 1.1 + 0.2, o: Math.random() * 0.4 + 0.1,
    })))
    const stored = localStorage.getItem('override_visited_planets')
    const visited: string[] = stored ? JSON.parse(stored) : []
    if (currentPlanet && !visited.includes(currentPlanet)) {
      const updated = [...visited, currentPlanet]
      localStorage.setItem('override_visited_planets', JSON.stringify(updated))
      setVisitedPlanets(updated)
    } else {
      setVisitedPlanets(visited)
    }
  }, [currentPlanet])

  useEffect(() => {
    async function load() {
      if (userId) {
        try {
          const data = await getUserById(userId)
          setPass(data)
        } catch {
          if (offlineData) buildOffline(offlineData)
          else setLoading(false)
          return
        }
      } else if (offlineData) {
        buildOffline(offlineData)
        return
      }
      setLoading(false)
    }
    function buildOffline(od: OfflinePassData) {
      const rec = ROUTING[od.planet]?.[od.intensity]
      setPass({
        id: 'offline', name: od.name, planet: od.planet, intensity: od.intensity,
        recommendation: rec?.key || 'jupiter', level: od.level || 'NEW_RECRUIT',
        status: 'LAUNCHED', created_at: new Date().toISOString(), scan_count: 1,
      })
      setLoading(false)
    }
    load()
  }, [userId, offlineData])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-5xl animate-bounce">🚀</div>
          <div className="w-48 h-px relative overflow-hidden bg-white/10">
            <div className="absolute inset-y-0 w-full"
              style={{ background: 'linear-gradient(90deg,transparent,rgba(0,212,255,0.8),transparent)', animation: 'scan 1.5s linear infinite' }} />
          </div>
          <p className="text-[0.44rem] tracking-[0.25em] uppercase text-white/30">LOADING PASS...</p>
        </div>
        <style>{`@keyframes scan{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
      </div>
    )
  }

  if (!pass) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center px-6">
        <div className="max-w-[400px] w-full text-center flex flex-col gap-5">
          <h2 className="font-display font-extrabold text-2xl text-white/50">NO PASS FOUND</h2>
          <button onClick={() => router.push('/mission')}
            className="w-full py-4 text-[0.6rem] tracking-[0.18em] uppercase font-mono text-white"
            style={{ background: 'linear-gradient(135deg,rgba(0,40,120,0.9),rgba(50,0,100,0.9))', border: '1px solid rgba(0,212,255,0.3)' }}>
            BEGIN MISSION BRIEFING →
          </button>
        </div>
      </div>
    )
  }

  const planet = currentPlanet || pass.planet || 'jupiter'
  const intensity = currentIntensity || pass.intensity || 'perfect'
  const pc = PLANET_COLORS[planet] || PLANET_COLORS.jupiter
  const rec = ROUTING[planet]?.[intensity]
  const recPlanet = rec?.key || 'jupiter'
  const recData = rec

  const flightCode = `${PLANET_CODES[planet] || 'SS-???'}-${pass.id.slice(-4).toUpperCase()}`
  const passDate = new Date(pass.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  }).toUpperCase()
  const levelDisplay = LEVEL_DISPLAY[pass.level] || 'NEW RECRUIT — ECONOMY'
  const scanCount = pass.scan_count || 1
  const streak = pass.streak_count || 0
  const stateInfo = STATE_DISPLAY[pass.state || 'NEW_USER'] || STATE_DISPLAY.NEW_USER
  const visitedCore = visitedPlanets.filter(p => CORE_PLANETS.includes(p))
  const filledSegments = Math.max(1, visitedCore.length)

  // Flight history from DB or localStorage
  const flightHistory: FlightRecord[] = pass.flight_history?.length
    ? pass.flight_history
    : visitedPlanets.map((p, i) => ({
        planet: p,
        date: new Date(Date.now() - (visitedPlanets.length - i) * 86400000 * 7).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase(),
        intensity: 'perfect',
      }))

  const upgradeMessages: Record<string, string> = {
    NEW_RECRUIT:   'Scan OVERRIDE again to unlock Crew Member — Business Class.',
    CREW_MEMBER:   'One more scan unlocks Inner Circle — First Class + Paradise early access.',
    INNER_CIRCLE:  'One more scan reaches First Contact — Private Charter + Paradise 72hrs early.',
    FIRST_CONTACT: 'First Contact — Private Charter. You are at the top of the orbit.',
  }

  const handleShare = async () => {
    const url = `https://www.overridecannabis.com/boarding-pass?id=${pass.id}&cp=${planet}&ci=${intensity}`
    const text = `I just boarded OVERRIDE ${PLANET_NAMES[planet]} 🚀 Mission Briefing activated. LA 2026.`
    if (navigator.share) {
      try { await navigator.share({ title: 'OVERRIDE™ Boarding Pass', text, url }) } catch {}
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`)
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleScanNew = () => {
    localStorage.removeItem('override_last_intensity')
    router.push('/mission')
  }

  return (
    <div className="relative min-h-screen bg-[#060608] overflow-hidden">
      {/* Stars */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {stars.map((s, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{ left:`${s.x}%`, top:`${s.y}%`, width:s.r, height:s.r, opacity:s.o }} />
        ))}
      </div>

      {/* Planet ambient */}
      <div className="fixed inset-0 z-0 pointer-events-none transition-all duration-1000"
        style={{ background: PLANET_BG[planet] || PLANET_BG.jupiter }} />

      {/* Faded planet */}
      <div className="fixed right-[-40px] top-[8%] z-0 pointer-events-none select-none"
        style={{ fontSize: '260px', opacity: 0.05, filter: 'blur(3px)', lineHeight: 1 }}>
        {PLANET_EMOJIS[planet]}
      </div>

      {/* NAV */}
      <div className="relative z-20 flex items-center justify-between px-5 py-3 border-b border-white/[0.06]"
        style={{ background: 'rgba(6,6,8,0.85)', backdropFilter: 'blur(12px)' }}>
        <span className="font-display font-extrabold text-sm tracking-[0.2em]">
          OVERRIDE<sup className="text-[0.4em] opacity-40">™</sup>
        </span>
        <div className="flex items-center gap-3">
          <a href="/mission" className="text-[0.42rem] tracking-[0.15em] uppercase text-white/30 hover:text-white/60 transition-colors">MISSION</a>
          <a href="/budtender" className="text-[0.42rem] tracking-[0.15em] uppercase text-white/30 hover:text-white/60 transition-colors">CREW</a>
          <span className="flex items-center gap-1 text-[0.42rem] tracking-[0.2em] uppercase"
            style={{ color: 'rgba(80,255,128,0.8)' }}>
            <span className="w-1.5 h-1.5 rounded-full blink" style={{ background: 'rgba(80,255,128,0.8)' }} />
            AUTHORIZED
          </span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 pt-4 pb-8 safe-bottom">
        <div className="w-full max-w-[420px] flex flex-col items-center gap-3">

          {/* TITLE */}
          <div className="w-full text-center py-1">
            <h1 className="font-display font-extrabold tracking-[0.06em] text-white leading-none"
              style={{ fontSize: 'clamp(2rem, 10vw, 2.8rem)' }}>
              BOARDING PASS
            </h1>
            <p className="text-[0.42rem] tracking-[0.2em] uppercase mt-1"
              style={{ color: 'rgba(80,255,128,0.8)' }}>
              ● LAUNCH AUTHORIZED · {stateInfo.label}
            </p>
          </div>

          {/* ═══ BOARDING PASS CARD — United-style ═══ */}
          <div className="w-full rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(170deg, rgba(10,10,18,0.97) 0%, rgba(14,10,28,0.97) 100%)',
              border: `1px solid ${pc.accent}25`,
              boxShadow: `0 0 80px ${pc.glow}, 0 24px 48px rgba(0,0,0,0.6)`,
            }}>

            {/* HEADER BAND — airline color bar */}
            <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${pc.accent}, ${pc.accent}80)` }} />

            {/* TOP SECTION — route */}
            <div className="px-5 pt-4 pb-4 border-b border-white/[0.06]">
              {/* Airline row */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-display font-extrabold text-base tracking-[0.15em] text-white leading-none">
                    OVERRIDE<sup className="text-[0.4em] opacity-35">™</sup>
                  </p>
                  <p className="text-[0.36rem] tracking-[0.18em] uppercase text-white/25 mt-0.5">SPACESHIP STRAINS™</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[0.36rem] tracking-[0.2em] uppercase px-2 py-1 rounded-sm"
                    style={{ background: `${pc.accent}15`, color: pc.accent, border: `1px solid ${pc.accent}30` }}>
                    BOARDING PASS
                  </span>
                  {streak >= 4 && (
                    <span className="text-[0.34rem] tracking-[0.1em] text-amber-400/80">🔥 {streak} WEEK STREAK</span>
                  )}
                </div>
              </div>

              {/* ROUTE — big airport-style */}
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <span className="font-display font-extrabold text-4xl tracking-tight text-white leading-none">LAX</span>
                  <span className="text-[0.36rem] tracking-[0.12em] uppercase text-white/30 mt-0.5">LOS ANGELES</span>
                </div>

                <div className="flex-1 flex flex-col items-center gap-1 px-2">
                  {/* Flight path line */}
                  <div className="w-full flex items-center gap-1">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-white/40 text-xs">✈</span>
                    <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${pc.accent}40, transparent)` }} />
                  </div>
                  <span className="text-[0.34rem] tracking-[0.1em] uppercase text-white/20">{flightCode}</span>
                </div>

                <div className="flex flex-col items-end">
                  <span className="font-display font-extrabold text-4xl tracking-tight leading-none"
                    style={{ color: pc.accent, fontSize: 'clamp(1.6rem, 9vw, 2.2rem)' }}>
                    {PLANET_SHORT[planet] || PLANET_NAMES[planet]}
                  </span>
                  <span className="text-[0.36rem] tracking-[0.12em] uppercase text-white/30 mt-0.5">
                    {PLANET_NAMES[planet]}
                  </span>
                </div>
              </div>
            </div>

            {/* PASSENGER DETAILS — grid */}
            <div className="px-5 py-3 border-b border-white/[0.06]">
              <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                {[
                  { label: 'PASSENGER', value: pass.name.toUpperCase(), span: true },
                  { label: 'DATE', value: passDate },
                  { label: 'CLASS', value: levelDisplay, color: pc.accent, small: true },
                  { label: 'NEXT PLANET', value: PLANET_NAMES[recPlanet] || '—', color: pc.accent },
                  { label: 'STATUS', value: pass.status, color: 'rgba(80,255,128,0.8)' },
                ].map(({ label, value, color, small, span }) => (
                  <div key={label} className={span ? 'col-span-3' : ''}>
                    <p className="text-[0.32rem] tracking-[0.2em] uppercase text-white/22 mb-0.5">{label}</p>
                    <p className={`font-display font-bold leading-tight ${small ? 'text-[0.52rem]' : 'text-[0.72rem]'} tracking-[0.04em]`}
                      style={{ color: color || 'white' }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* PLANET PROGRESS BAR */}
            <div className="px-5 py-3 border-b border-white/[0.06]">
              <p className="text-[0.32rem] tracking-[0.2em] uppercase text-white/22 mb-2">ORBIT PROGRESS</p>
              <div className="flex gap-1.5">
                {CORE_PLANETS.map(p => {
                  const isVisited = visitedCore.includes(p)
                  const isCurrent = p === planet
                  const pColor = PLANET_COLORS[p]?.accent || '#00d4ff'
                  return (
                    <div key={p} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full h-1 rounded-full transition-all duration-700"
                        style={{
                          background: isCurrent ? pColor : isVisited ? `${pColor}50` : 'rgba(255,255,255,0.06)',
                          boxShadow: isCurrent ? `0 0 6px ${pColor}` : 'none',
                        }} />
                      <span className="text-[0.28rem] tracking-[0.06em] uppercase"
                        style={{ color: isCurrent ? pColor : isVisited ? `${pColor}70` : 'rgba(255,255,255,0.15)' }}>
                        {PLANET_NAMES[p].slice(0,3)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* TEAR LINE */}
            <div className="flex items-center mx-0">
              <div className="w-4 h-4 rounded-full -ml-2 flex-shrink-0"
                style={{ background: '#060608', border: '1px solid rgba(255,255,255,0.08)' }} />
              <div className="flex-1 border-t border-dashed border-white/[0.07]" />
              <div className="w-4 h-4 rounded-full -mr-2 flex-shrink-0"
                style={{ background: '#060608', border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>

            {/* STUB */}
            <div className="px-5 py-3">
              <div className="grid grid-cols-3 gap-4 mb-3">
                {[
                  { label: 'GATE', value: 'SS-01' },
                  { label: 'SEAT', value: `${String.fromCharCode(65 + (pass.id.charCodeAt(0) % 6))}${(pass.id.charCodeAt(1) % 30) + 1}` },
                  { label: 'MISSION', value: `${scanCount} of ∞`, color: pc.accent },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <p className="text-[0.3rem] tracking-[0.18em] uppercase text-white/22 mb-0.5">{label}</p>
                    <p className="font-display font-bold text-sm" style={{ color: color || 'white' }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* QR CODE AREA — visible barcode-style */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-10 rounded opacity-[0.08]"
                  style={{ background: 'repeating-linear-gradient(90deg,white 0,white 1.5px,transparent 1.5px,transparent 3px,white 3px,white 4px,transparent 4px,transparent 6px,white 6px,white 7px,transparent 7px,transparent 10px,white 10px,white 12px,transparent 12px,transparent 14px)' }} />
                <div className="flex flex-col items-end">
                  <span className="text-[0.28rem] tracking-[0.12em] uppercase text-white/15">OVERRIDE™</span>
                  <span className="text-[0.28rem] tracking-[0.08em] text-white/10">{pass.id.slice(-8).toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* NEXT DESTINATION */}
          {recData && (
            <div className="w-full rounded-xl border border-white/[0.06] bg-white/[0.01] p-4">
              <p className="text-[0.36rem] tracking-[0.2em] uppercase text-white/22 mb-2">// NEXT DESTINATION UNLOCKED</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{recData.emoji}</span>
                <div>
                  <p className="font-display font-extrabold text-lg tracking-[0.1em]" style={{ color: pc.accent }}>{recData.name}</p>
                  <p className="text-[0.46rem] text-white/35 leading-relaxed mt-0.5">{recData.desc}</p>
                </div>
              </div>
            </div>
          )}

          {/* UPGRADE MESSAGE */}
          <div className="w-full rounded-xl border border-amber-400/15 bg-amber-400/[0.03] px-4 py-3">
            <p className="text-[0.46rem] text-amber-300/55 leading-relaxed tracking-[0.03em]">
              {upgradeMessages[pass.level] || upgradeMessages.NEW_RECRUIT}
            </p>
          </div>

          {/* STREAK + HOME PLANET */}
          {(streak > 0 || pass.home_planet) && (
            <div className="w-full grid grid-cols-2 gap-2">
              {streak > 0 && (
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-3 text-center">
                  <p className="text-[0.32rem] tracking-[0.18em] uppercase text-white/22 mb-1">STREAK</p>
                  <p className="font-display font-extrabold text-xl" style={{ color: streak >= 4 ? '#f0b428' : pc.accent }}>
                    {streak >= 4 ? '🔥' : '⚡'} {streak}
                  </p>
                  <p className="text-[0.32rem] uppercase text-white/20 mt-0.5">{streak >= 4 ? 'ON FIRE' : 'WEEKS'}</p>
                </div>
              )}
              {pass.home_planet && (
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-3 text-center">
                  <p className="text-[0.32rem] tracking-[0.18em] uppercase text-white/22 mb-1">HOME PLANET</p>
                  <p className="text-2xl">{PLANET_EMOJIS[pass.home_planet]}</p>
                  <p className="text-[0.38rem] tracking-[0.06em] uppercase font-bold mt-0.5" style={{ color: PLANET_COLORS[pass.home_planet]?.accent || pc.accent }}>
                    {PLANET_NAMES[pass.home_planet]}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* FLIGHT HISTORY */}
          {flightHistory.length > 0 && (
            <div className="w-full rounded-xl border border-white/[0.06] bg-white/[0.01] overflow-hidden">
              <button onClick={() => setShowHistory(!showHistory)}
                className="w-full flex items-center justify-between px-4 py-3 active:opacity-70">
                <span className="text-[0.38rem] tracking-[0.18em] uppercase text-white/40">// FLIGHT HISTORY</span>
                <span className="text-[0.38rem] tracking-[0.15em] uppercase text-white/25">{showHistory ? '▲ HIDE' : '▼ SHOW'}</span>
              </button>
              {showHistory && (
                <div className="px-4 pb-3 flex flex-col gap-2">
                  {flightHistory.slice().reverse().slice(0, 8).map((f, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-t border-white/[0.04]">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{PLANET_EMOJIS[f.planet] || '🔴'}</span>
                        <div>
                          <p className="text-[0.48rem] font-bold tracking-[0.06em]"
                            style={{ color: PLANET_COLORS[f.planet]?.accent || 'white' }}>
                            {PLANET_NAMES[f.planet] || f.planet.toUpperCase()}
                          </p>
                          <p className="text-[0.36rem] uppercase text-white/25 tracking-[0.06em]">{f.intensity || 'PERFECT'}</p>
                        </div>
                      </div>
                      <span className="text-[0.38rem] tracking-[0.08em] uppercase text-white/30">{f.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* REFERRAL */}
          {pass.referral_code && (
            <div className="w-full rounded-xl border border-white/[0.06] bg-white/[0.01] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[0.36rem] tracking-[0.18em] uppercase text-white/30">// REFER CREW</span>
                {pass.referral_count ? (
                  <span className="text-[0.38rem] tracking-[0.1em] uppercase px-2 py-0.5 rounded-sm"
                    style={{ background: `${pc.accent}15`, color: pc.accent }}>
                    {pass.referral_count} REFERRED
                  </span>
                ) : null}
              </div>
              <p className="text-[0.46rem] text-white/35 leading-relaxed mb-3">
                Share your code. Friend completes Mission Briefing = you both unlock Paradise early access.
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-black/40 border border-white/10 px-3 py-2 text-center rounded-lg">
                  <span className="font-mono text-sm font-bold tracking-[0.15em]" style={{ color: pc.accent }}>
                    {pass.referral_code}
                  </span>
                </div>
                <button onClick={() => {
                  const url = `https://www.overridecannabis.com/mission?ref=${pass.referral_code}`
                  if (navigator.share) navigator.share({ title: 'OVERRIDE™', text: 'Join me on OVERRIDE 🚀', url })
                  else { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000) }
                }}
                  className="px-4 py-2 rounded-lg text-[0.5rem] tracking-[0.12em] uppercase font-mono text-white active:opacity-70"
                  style={{ background: `${pc.accent}20`, border: `1px solid ${pc.accent}40` }}>
                  {copied ? '✓' : 'SHARE'}
                </button>
              </div>
            </div>
          )}

          {/* SHARE */}
          <button onClick={handleShare}
            className="w-full py-4 rounded-xl text-[0.6rem] tracking-[0.18em] uppercase font-mono text-white active:opacity-70 flex items-center justify-center gap-2"
            style={{ background: `linear-gradient(135deg, ${pc.accent}25, ${pc.accent}10)`, border: `1px solid ${pc.accent}40` }}>
            ↑ SHARE YOUR BOARDING PASS
          </button>

          <a href="https://spaceshipstrains.com" className="w-full">
            <button className="w-full py-3.5 rounded-xl text-[0.58rem] tracking-[0.15em] uppercase font-mono text-white active:opacity-70"
              style={{ background: 'linear-gradient(135deg,rgba(0,40,120,0.9),rgba(50,0,100,0.9))', border: `1px solid ${pc.accent}30` }}>
              EXPLORE ALL PLANETS →
            </button>
          </a>

          <div className="w-full grid grid-cols-2 gap-2">
            <a href="https://instagram.com/spaceshipstrains" target="_blank" rel="noopener">
              <button className="w-full py-3 rounded-xl text-[0.48rem] tracking-[0.1em] uppercase font-mono active:opacity-70"
                style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.35)' }}>
                @SPACESHIPSTRAINS
              </button>
            </a>
            <button onClick={handleScanNew}
              className="w-full py-3 rounded-xl text-[0.48rem] tracking-[0.1em] uppercase font-mono active:opacity-70"
              style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.25)' }}>
              SCAN NEW PLANET →
            </button>
          </div>

          <p className="text-[0.32rem] tracking-[0.15em] uppercase text-white/[0.07] text-center pb-2">
            OVERRIDE™ · SPACESHIP STRAINS™ · MISSION BRIEFING™ · LOS ANGELES · 2026
          </p>
        </div>
      </div>
    </div>
  )
}