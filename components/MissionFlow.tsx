'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  upsertUser,
  incrementScanCount,
  logEvent,
  PLANET_COLORS,
  PLANET_NAMES,
  PLANET_SUBTITLES,
  ROUTING,
} from '@/lib/supabase'

type Screen = 'entry' | 'name' | 'planet' | 'intensity' | 'contact' | 'launching'

const PLANETS = ['mars', 'jupiter', 'saturn', 'venus', 'neptune', 'moonrock'] as const
type Planet = typeof PLANETS[number]

const PLANET_INFO = {
  mars:     { emoji: '🔴', desc: 'Heavy · Intense · High THC' },
  jupiter:  { emoji: '🟡', desc: 'Balanced · Social · Creative' },
  saturn:   { emoji: '🪐', desc: 'Smooth · Mellow · Terpene-Rich' },
  venus:    { emoji: '✨', desc: 'Uplift · Creative · Warm' },
  neptune:  { emoji: '🌊', desc: 'Deep Calm · Nighttime' },
  moonrock: { emoji: '🌙', desc: 'Maximum Intensity' },
}

const INTENSITY_OPTIONS = [
  { key: 'less',    emoji: '🌤', label: 'TOO STRONG',  sub: 'Route me somewhere smoother' },
  { key: 'perfect', emoji: '🎯', label: 'PERFECT',     sub: 'Exactly what I wanted' },
  { key: 'more',    emoji: '🚀', label: 'WANT MORE',   sub: 'Push the orbit further' },
]

// #7 Typewriter hook
function useTypewriter(text: string, speed = 40, start = false) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (!start || !text) return
    setDisplayed('')
    setDone(false)
    let i = 0
    const timer = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) { clearInterval(timer); setDone(true) }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed, start])
  return { displayed, done }
}

export default function MissionFlow({ scanPlanet }: { scanPlanet?: string }) {
  const router = useRouter()
  const [screen, setScreen] = useState<Screen>('entry')
  const [name, setName] = useState('')
  const [planet, setPlanet] = useState<Planet | ''>(scanPlanet as Planet || '')
  const [intensity, setIntensity] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [accentColor, setAccentColor] = useState('rgba(0,212,255,0.8)')
  const [glowColor, setGlowColor] = useState('rgba(0,80,200,0.15)')
  const [nameError, setNameError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [stars, setStars] = useState<Array<{ x: number; y: number; r: number; o: number }>>([])
  const [typewriterStarted, setTypewriterStarted] = useState(false)
  // #6 Returning user name pre-fill
  const [isReturningUser, setIsReturningUser] = useState(false)

  // #7 Typewriter for destination line
  const activePlanet = planet || scanPlanet || ''
  const destText = activePlanet
    ? `DESTINATION: ${PLANET_NAMES[activePlanet]}`
    : 'AWAITING PLANET DATA...'
  const { displayed: typedDest, done: typeDone } = useTypewriter(destText, 45, typewriterStarted)

  // Stars
  useEffect(() => {
    const s = Array.from({ length: 150 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: Math.random() * 1.2 + 0.3,
      o: Math.random() * 0.5 + 0.1,
    }))
    setStars(s)
    // Start typewriter after 600ms
    setTimeout(() => setTypewriterStarted(true), 600)
  }, [])

  // Set accent from scan planet
  useEffect(() => {
    if (scanPlanet && PLANET_COLORS[scanPlanet]) {
      setAccentColor(PLANET_COLORS[scanPlanet].accent)
      setGlowColor(PLANET_COLORS[scanPlanet].glow)
    }
  }, [scanPlanet])

  // #6 Pre-fill name and detect returning user
  useEffect(() => {
    const existingId = localStorage.getItem('override_user_id')
    const savedName = localStorage.getItem('override_name')
    if (existingId) {
      setIsReturningUser(true)
      if (savedName) setName(savedName)
      incrementScanCount(existingId).then(result => {
        if (result) localStorage.setItem('override_level', result.level)
      }).catch(() => {})
    }
  }, [])

  const setAccent = useCallback((p: string) => {
    if (PLANET_COLORS[p]) {
      setAccentColor(PLANET_COLORS[p].accent)
      setGlowColor(PLANET_COLORS[p].glow)
    }
  }, [])

  const goTo = (s: Screen) => {
    setScreen(s)
    window.scrollTo(0, 0)
  }

  // STEP 1: Name
  const submitName = () => {
    if (!name.trim()) { setNameError(true); return }
    setNameError(false)
    // Save name for future pre-fill
    localStorage.setItem('override_name', name.trim())

    // #4 Skip planet screen if from QR URL
    if (scanPlanet && PLANETS.includes(scanPlanet as Planet)) {
      setPlanet(scanPlanet as Planet)
      goTo('intensity')
    } else {
      goTo('planet')
    }
  }

  // STEP 2: Planet
  const selectPlanet = (p: Planet) => {
    setPlanet(p)
    setAccent(p)
    setTimeout(() => goTo('intensity'), 300)
  }

  // STEP 3: Intensity
  const selectIntensity = (i: string) => {
    setIntensity(i)
    const existingId = localStorage.getItem('override_user_id')
    if (existingId) {
      // Returning user same device — skip contact, go straight to boarding pass
      setTimeout(() => goTo('launching'), 300)
      setTimeout(async () => {
        const finalPlanet = planet || scanPlanet || 'jupiter'
        const rec = ROUTING[finalPlanet]?.[i]
        try {
          await logEvent(existingId, 'mission_completed', {
            planet: finalPlanet, intensity: i, recommendation: rec?.key, returning: true,
          })
          localStorage.setItem('override_planet', finalPlanet)
        } catch {}
        router.push(`/boarding-pass?id=${existingId}`)
      }, 500)
    } else {
      setTimeout(() => goTo('contact'), 300)
    }
  }

  // STEP 4: Finalize
  const finalize = async () => {
    const existingId = localStorage.getItem('override_user_id')
    if (existingId) {
      goTo('launching')
      try {
        const finalPlanet = planet || 'jupiter'
        const finalIntensity = intensity || 'perfect'
        const rec = ROUTING[finalPlanet]?.[finalIntensity]
        await logEvent(existingId, 'mission_completed', {
          planet: finalPlanet, intensity: finalIntensity, recommendation: rec?.key, returning: true,
        })
        localStorage.setItem('override_planet', finalPlanet)
        router.push(`/boarding-pass?id=${existingId}`)
      } catch {
        router.push(`/boarding-pass?id=${existingId}`)
      }
      return
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      setEmailError(true); return
    }
    setEmailError(false)
    goTo('launching')

    try {
      const finalPlanet = planet || 'jupiter'
      const finalIntensity = intensity || 'perfect'
      const rec = ROUTING[finalPlanet]?.[finalIntensity]

      const { user } = await upsertUser({
        name: name.trim(),
        planet: finalPlanet,
        intensity: finalIntensity,
        recommendation: rec?.key || '',
        email,
        phone: phone || undefined,
      })

      await logEvent(user.id, 'mission_completed', {
        planet: finalPlanet, intensity: finalIntensity, recommendation: rec?.key,
      })

      localStorage.setItem('override_user_id', user.id)
      localStorage.setItem('override_planet', finalPlanet)
      localStorage.setItem('override_level', user.level)
      localStorage.setItem('override_name', name.trim())
      localStorage.setItem('override_scan_ts', new Date().toISOString())

      router.push(`/boarding-pass?id=${user.id}`)
    } catch (err) {
      console.error('Mission finalize error:', err)
      router.push(`/boarding-pass?planet=${planet}&name=${encodeURIComponent(name)}&intensity=${intensity}&offline=true`)
    }
  }

  const pc = activePlanet ? PLANET_COLORS[activePlanet] : null

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
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 30%, ${glowColor} 0%, transparent 70%)` }} />

      <div className="relative z-10 min-h-screen flex flex-col items-center px-6 py-8 safe-top safe-bottom">
        <div className="w-full max-w-[440px] flex flex-col items-center gap-5 flex-1 justify-center">

          {/* ═══ ENTRY ═══ */}
          {screen === 'entry' && (
            <div className="w-full flex flex-col items-center gap-5 screen-enter">
              <div className="w-full flex items-center justify-between pb-4 border-b border-white/[0.07]">
                <span className="font-display font-extrabold text-lg tracking-[0.2em]">
                  OVERRIDE<sup className="text-[0.4em] opacity-40">™</sup>
                </span>
                <span className="text-[0.42rem] tracking-[0.2em] uppercase flex items-center gap-1.5"
                  style={{ color: accentColor }}>
                  <span className="w-1.5 h-1.5 rounded-full blink" style={{ background: accentColor, boxShadow: `0 0 6px ${accentColor}` }} />
                  SYSTEM ONLINE
                </span>
              </div>

              {isReturningUser && (
                <div className="w-full px-3 py-2 border text-center"
                  style={{ borderColor: `${accentColor}30`, background: `${accentColor}08` }}>
                  <span className="text-[0.44rem] tracking-[0.15em] uppercase" style={{ color: accentColor }}>
                    ↩ RETURNING CREW DETECTED
                  </span>
                </div>
              )}

              <p className="text-[0.44rem] tracking-[0.28em] uppercase text-white/20 text-center">
                OVERRIDE™ SYSTEM ACCESS PORTAL
              </p>

              <h1 className="font-display font-extrabold text-5xl tracking-[0.08em] text-center text-white leading-none">
                MISSION<br />BRIEFING<sup className="text-[0.35em] opacity-35">™</sup>
              </h1>

              {/* #7 Typewriter destination box */}
              <div className="w-full border relative overflow-hidden px-5 py-4 text-center sweep"
                style={{ borderColor: `${accentColor}40`, background: 'rgba(0,0,0,0.35)' }}>
                <span className="font-display font-extrabold text-lg tracking-[0.15em] block"
                  style={{ color: accentColor }}>
                  {typedDest}
                  {!typeDone && <span className="animate-pulse">_</span>}
                </span>
                <span className="text-[0.42rem] tracking-[0.2em] uppercase text-white/25 mt-1 block">
                  {typeDone && activePlanet ? PLANET_SUBTITLES[activePlanet] : 'INITIALIZING PLANET PROTOCOL'}
                </span>
              </div>

              <p className="text-[0.46rem] tracking-[0.18em] uppercase text-white/25 text-center">
                SYSTEM STATUS: <span className="text-green-400/80">AWAITING CONFIRMATION</span>
              </p>

              <button onClick={() => goTo('name')}
                className="w-full py-4 text-[0.65rem] tracking-[0.18em] uppercase font-mono text-white transition-opacity active:opacity-70"
                style={{ background: 'linear-gradient(135deg, rgba(0,40,120,0.9), rgba(50,0,100,0.9))', border: `1px solid ${accentColor}40` }}>
                ▶ BEGIN BRIEFING
              </button>

              <p className="text-[0.4rem] tracking-[0.15em] uppercase text-white/15 text-center">
                SPACESHIP STRAINS™ · EST. LOS ANGELES 2026
              </p>
            </div>
          )}

          {/* ═══ NAME ═══ */}
          {screen === 'name' && (
            <div className="w-full flex flex-col items-center gap-5 screen-enter">
              <div className="w-full flex gap-1">
                {[0,1,2,3].map(i => (
                  <div key={i} className="flex-1 h-0.5 transition-all duration-300"
                    style={{ background: i === 0 ? accentColor : 'rgba(255,255,255,0.07)' }} />
                ))}
              </div>
              <p className="text-[0.44rem] tracking-[0.28em] uppercase text-white/20">STEP 01 · IDENTITY VERIFICATION</p>
              <h2 className="font-display font-bold text-2xl text-center text-white leading-tight">
                {isReturningUser ? 'Welcome back.' : 'What should we call you?'}
              </h2>
              <p className="text-[0.44rem] tracking-[0.15em] uppercase text-white/22 text-center">
                {isReturningUser ? 'Confirm your designation to continue' : 'Crew designation required for clearance'}
              </p>
              <div className="w-full">
                <span className="text-[0.42rem] tracking-[0.2em] uppercase text-white/22 mb-2 block">// DESIGNATION</span>
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setNameError(false) }}
                  onKeyDown={e => e.key === 'Enter' && submitName()}
                  placeholder="ENTER YOUR NAME"
                  autoComplete="given-name"
                  autoCorrect="off"
                  spellCheck={false}
                  className="w-full bg-black/40 text-white font-mono text-sm py-4 px-4 outline-none placeholder:text-white/20 placeholder:text-xs transition-all border border-white/10"
                  style={{ borderBottom: `2px solid ${nameError ? 'rgba(255,80,80,0.7)' : accentColor}` }}
                  autoFocus
                />
              </div>
              <button onClick={submitName}
                className="w-full py-4 text-[0.65rem] tracking-[0.18em] uppercase font-mono text-white active:opacity-70"
                style={{ background: 'linear-gradient(135deg, rgba(0,40,120,0.9), rgba(50,0,100,0.9))', border: `1px solid ${accentColor}40` }}>
                CONFIRM →
              </button>
            </div>
          )}

          {/* ═══ PLANET ═══ */}
          {screen === 'planet' && (
            <div className="w-full flex flex-col items-center gap-4 screen-enter">
              <div className="w-full flex gap-1">
                {[0,1,2,3].map(i => (
                  <div key={i} className="flex-1 h-0.5 transition-all duration-300"
                    style={{ background: i <= 1 ? accentColor : 'rgba(255,255,255,0.07)' }} />
                ))}
              </div>
              <p className="text-[0.44rem] tracking-[0.28em] uppercase text-white/20">STEP 02 · DESTINATION SELECTION</p>
              <h2 className="font-display font-bold text-2xl text-center text-white leading-tight">
                Which planet did you<br />just experience?
              </h2>
              <div className="w-full flex flex-col gap-2.5">
                {PLANETS.map(p => (
                  <button key={p} onClick={() => selectPlanet(p)}
                    className="w-full flex items-center gap-3 py-4 px-4 text-left transition-all active:opacity-70 border border-white/[0.07] bg-white/[0.02]"
                    style={planet === p ? { borderColor: `${PLANET_COLORS[p].accent}60`, background: 'rgba(0,0,0,0.3)', color: 'white' } : { color: 'rgba(255,255,255,0.55)' }}>
                    <span className="text-xl flex-shrink-0">{PLANET_INFO[p].emoji}</span>
                    <div className="flex flex-col">
                      <span className="text-[0.6rem] tracking-[0.1em] uppercase font-mono font-bold">{PLANET_NAMES[p]}</span>
                      <span className="text-[0.45rem] tracking-[0.06em] uppercase text-white/30">{PLANET_INFO[p].desc}</span>
                    </div>
                    {planet === p && <span className="ml-auto text-xs" style={{ color: accentColor }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ═══ INTENSITY ═══ */}
          {screen === 'intensity' && (
            <div className="w-full flex flex-col items-center gap-5 screen-enter">
              <div className="w-full flex gap-1">
                {[0,1,2,3].map(i => (
                  <div key={i} className="flex-1 h-0.5 transition-all duration-300"
                    style={{ background: i <= 2 ? accentColor : 'rgba(255,255,255,0.07)' }} />
                ))}
              </div>
              <p className="text-[0.44rem] tracking-[0.28em] uppercase text-white/20">STEP 03 · ACCESS CLASSIFICATION</p>
              <h2 className="font-display font-bold text-2xl text-center text-white leading-tight">
                How was the<br />intensity?
              </h2>
              <p className="text-[0.44rem] tracking-[0.15em] uppercase text-white/22 text-center">
                This routes your next destination
              </p>
              <div className="w-full flex flex-col gap-2.5">
                {INTENSITY_OPTIONS.map(opt => (
                  <button key={opt.key} onClick={() => selectIntensity(opt.key)}
                    className="w-full flex items-center gap-3 py-4 px-4 text-left transition-all active:opacity-70 border border-white/[0.07] bg-white/[0.02]"
                    style={intensity === opt.key ? { borderColor: `${accentColor}60`, background: 'rgba(0,0,0,0.3)' } : {}}>
                    <span className="text-xl flex-shrink-0">{opt.emoji}</span>
                    <div>
                      <span className="text-[0.62rem] tracking-[0.1em] uppercase font-mono block text-white">{opt.label}</span>
                      <span className="text-[0.45rem] tracking-[0.06em] uppercase text-white/30">{opt.sub}</span>
                    </div>
                    {intensity === opt.key && <span className="ml-auto text-xs" style={{ color: accentColor }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ═══ CONTACT ═══ */}
          {screen === 'contact' && (
            <div className="w-full flex flex-col items-center gap-5 screen-enter">
              <div className="w-full flex gap-1">
                {[0,1,2,3].map(i => (
                  <div key={i} className="flex-1 h-0.5" style={{ background: accentColor }} />
                ))}
              </div>
              <p className="text-[0.44rem] tracking-[0.28em] uppercase text-white/20">STEP 04 · CLEARANCE FINALIZATION</p>
              <h2 className="font-display font-bold text-2xl text-center text-white leading-tight">
                Finalize your<br />clearance
              </h2>
              <p className="text-[0.44rem] tracking-[0.15em] uppercase text-white/22 text-center">
                Required to receive your boarding pass
              </p>
              <div className="w-full flex flex-col gap-3">
                <div>
                  <span className="text-[0.42rem] tracking-[0.2em] uppercase text-white/22 mb-1.5 block">// EMAIL — REQUIRED</span>
                  <input type="email" value={email}
                    onChange={e => { setEmail(e.target.value); setEmailError(false) }}
                    onKeyDown={e => e.key === 'Enter' && finalize()}
                    placeholder="YOUR@EMAIL.COM" autoComplete="email"
                    className="w-full bg-black/40 text-white font-mono text-sm py-3.5 px-4 outline-none placeholder:text-white/18 placeholder:text-xs border border-white/10"
                    style={{ borderBottom: `2px solid ${emailError ? 'rgba(255,80,80,0.7)' : accentColor}` }}
                  />
                </div>
                <div>
                  <span className="text-[0.42rem] tracking-[0.2em] uppercase text-white/22 mb-1.5 block">// PHONE — OPTIONAL</span>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (000) 000-0000" autoComplete="tel"
                    className="w-full bg-black/40 text-white font-mono text-sm py-3.5 px-4 outline-none placeholder:text-white/18 placeholder:text-xs border border-white/10"
                    style={{ borderBottom: `2px solid ${accentColor}60` }}
                  />
                </div>
              </div>
              <button onClick={finalize}
                className="w-full py-4 text-[0.65rem] tracking-[0.18em] uppercase font-mono text-white active:opacity-70"
                style={{ background: 'linear-gradient(135deg, rgba(0,40,120,0.9), rgba(50,0,100,0.9))', border: `1px solid ${accentColor}40` }}>
                FINALIZE CLEARANCE →
              </button>
              <p className="text-[0.38rem] tracking-[0.1em] uppercase text-white/15 text-center leading-relaxed">
                21+ · California · No Spam · Reply STOP to unsubscribe
              </p>
            </div>
          )}

          {/* ═══ LAUNCHING ═══ */}
          {screen === 'launching' && (
            <div className="w-full flex flex-col items-center gap-6 screen-enter">
              <div className="text-6xl animate-bounce">🚀</div>
              <h2 className="font-display font-extrabold text-3xl tracking-[0.08em] text-center text-white">
                LAUNCHING...
              </h2>
              <div className="w-full h-0.5 relative overflow-hidden bg-white/10">
                <div className="absolute inset-y-0 left-0 w-full animate-scan"
                  style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
              </div>
              <p className="text-[0.48rem] tracking-[0.2em] uppercase text-white/25">
                WRITING TO MISSION LOG...
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}