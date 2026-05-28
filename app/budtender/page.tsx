'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const PLANETS = [
  {
    key: 'mars',
    emoji: '🔴',
    name: 'MARS',
    type: 'Sativa',
    thc: '32%',
    color: '#ff4820',
    terpenes: 'Myrcene-dominant',
    effect: 'Heavy · Intense · Euphoric',
    desc: 'Maximum intensity. For experienced consumers who want the full experience every time.',
    recommend: 'For customers who ask for something heavy, high THC, or want maximum effect.',
    formats: ['Flower 3.5g', 'Pre-Roll 0.5g', 'Vape 1.0g', 'Gummies 10mg'],
  },
  {
    key: 'jupiter',
    emoji: '🟡',
    name: 'JUPITER',
    type: 'Hybrid',
    thc: '28%',
    color: '#f0b428',
    terpenes: 'Limonene-dominant',
    effect: 'Balanced · Social · Uplifting',
    desc: 'The flagship planet. Best entry point for any experience level.',
    recommend: 'For customers who want something balanced, social, or are trying OVERRIDE for the first time.',
    formats: ['Flower 3.5g', 'Pre-Roll 0.5g', 'Vape 1.0g', 'Gummies 10mg'],
  },
  {
    key: 'saturn',
    emoji: '🪐',
    name: 'SATURN',
    type: 'Indica',
    thc: '26%',
    color: '#c4a84a',
    terpenes: 'Linalool-dominant',
    effect: 'Smooth · Mellow · Terpene-Rich',
    desc: 'The connoisseur planet. Smooth, consistent burn with a full terpene profile.',
    recommend: 'For customers who prioritize terpenes, smoothness, or want a relaxing but not sedating experience.',
    formats: ['Flower 3.5g', 'Pre-Roll 0.5g'],
  },
  {
    key: 'venus',
    emoji: '✨',
    name: 'VENUS',
    type: 'Sativa',
    thc: '30%',
    color: '#ff64b4',
    terpenes: 'Pinene-dominant',
    effect: 'Uplift · Creative · Warm',
    desc: 'Warm, euphoric, and creative. Keeps your head clear and ideas flowing.',
    recommend: 'For customers who want to stay functional, creative, or are looking for a daytime sativa.',
    formats: ['Flower 3.5g', 'Pre-Roll 0.5g', 'Vape 1.0g'],
  },
  {
    key: 'neptune',
    emoji: '🌊',
    name: 'NEPTUNE',
    type: 'Indica',
    thc: '30%',
    color: '#4060ff',
    terpenes: 'Myrcene + Linalool',
    effect: 'Deep Calm · Introspective · Nighttime',
    desc: 'Premium nighttime indica. Deep, consistent body calm built for the end of the mission.',
    recommend: 'For customers who want help sleeping, deep relaxation, or heavy body effect without the intensity of Mars.',
    formats: ['Flower 3.5g', 'Pre-Roll 0.5g', 'Gummies 5mg'],
  },
]

const MOON_ROCK = {
  key: 'moonrock',
  emoji: '🌙',
  name: 'MOON ROCK',
  thc: '40-60%+',
  color: '#b464ff',
  desc: 'Flower soaked in live resin concentrate, rolled in premium kief. Three layers engineered for maximum intensity.',
  recommend: 'For experienced consumers ONLY who specifically ask for maximum THC or have high tolerance.',
  formats: ['Available on select planets'],
}

export default function BudtenderPage() {
  const [authed, setAuthed] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [registered, setRegistered] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('override_budtender') === '1') setAuthed(true)
  }, [])

  const handleAccess = async () => {
    // Valid budtender codes — in production these come from a dispensary-specific list
    const validCodes = ['BUDTENDER', 'CREW2026', 'OVERRIDE-BT']
    if (validCodes.includes(code.toUpperCase())) {
      setAuthed(true)
      localStorage.setItem('override_budtender', '1')

      // Register as budtender in Supabase if not already
      if (!registered) {
        await supabase.from('users').upsert({
          name: 'BUDTENDER',
          planet: 'jupiter',
          email: `budtender-${code.toLowerCase()}@overridecannabis.com`,
          level: 'CREW_MEMBER',
          is_budtender: true,
          dispensary_code: code.toUpperCase(),
          status: 'ACTIVE',
          scan_count: 1,
        }, { onConflict: 'email' })
        setRegistered(true)
      }
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center px-6">
        <div className="w-full max-w-[360px] flex flex-col gap-5">
          <div className="text-center">
            <div className="text-4xl mb-3">🚀</div>
            <h1 className="font-display font-extrabold text-2xl tracking-[0.1em] text-white">OVERRIDE™</h1>
            <p className="text-[0.52rem] tracking-[0.2em] uppercase text-white/50 mt-1">CREW ACCESS PORTAL</p>
            <p className="text-[0.44rem] tracking-[0.1em] text-white/30 mt-3 leading-relaxed">
              For OVERRIDE dispensary partners only.<br/>Enter your crew access code.
            </p>
          </div>
          <div>
            <span className="text-[0.42rem] tracking-[0.2em] uppercase text-white/25 mb-1.5 block">// CREW CODE</span>
            <input
              type="text"
              value={code}
              onChange={e => { setCode(e.target.value); setError(false) }}
              onKeyDown={e => e.key === 'Enter' && handleAccess()}
              placeholder="ENTER CODE"
              className="w-full bg-black/40 text-white font-mono text-sm py-4 px-4 outline-none placeholder:text-white/20 border border-white/10 uppercase tracking-widest"
              style={{ borderBottom: `2px solid ${error ? 'rgba(255,80,80,0.7)' : 'rgba(0,212,255,0.4)'}` }}
              autoFocus
            />
          </div>
          <button onClick={handleAccess}
            className="w-full py-4 text-[0.65rem] tracking-[0.18em] uppercase font-mono text-white"
            style={{ background: 'linear-gradient(135deg,rgba(0,40,120,0.9),rgba(50,0,100,0.9))', border: '1px solid rgba(0,212,255,0.4)' }}>
            ACCESS CREW PORTAL →
          </button>
          {error && <p className="text-[0.48rem] tracking-[0.15em] uppercase text-red-400/70 text-center">INVALID CODE</p>}
        </div>
      </div>
    )
  }

  const planet = PLANETS.find(p => p.key === selected)

  return (
    <div className="min-h-screen bg-[#060608] text-white font-mono">
      {/* Header */}
      <div className="border-b border-white/[0.07] px-5 py-4 flex items-center justify-between sticky top-0 bg-[#060608] z-10">
        <div>
          <span className="font-display font-extrabold text-base tracking-[0.15em]">OVERRIDE™</span>
          <span className="text-[0.4rem] tracking-[0.18em] uppercase text-white/30 ml-2">CREW GUIDE</span>
        </div>
        <button onClick={() => setSelected(null)}
          className="text-[0.42rem] tracking-[0.15em] uppercase text-white/30 border border-white/10 px-3 py-1.5"
          style={{ display: selected ? 'block' : 'none' }}>
          ← ALL PLANETS
        </button>
      </div>

      {!selected ? (
        <div className="px-5 py-6 max-w-lg mx-auto">
          <p className="text-[0.44rem] tracking-[0.2em] uppercase text-white/30 mb-5">
            // SELECT A PLANET TO SEE FULL PRODUCT INFO
          </p>

          {/* Quick reference */}
          <div className="border border-white/[0.07] bg-white/[0.01] p-4 mb-5">
            <p className="text-[0.44rem] tracking-[0.2em] uppercase text-white/30 mb-3">// QUICK RECOMMENDATION GUIDE</p>
            <div className="flex flex-col gap-2">
              {[
                { q: 'First time / balanced', a: '🟡 JUPITER', c: '#f0b428' },
                { q: 'Maximum THC / heavy', a: '🔴 MARS', c: '#ff4820' },
                { q: 'Daytime / creative', a: '✨ VENUS', c: '#ff64b4' },
                { q: 'Smooth / terpenes', a: '🪐 SATURN', c: '#c4a84a' },
                { q: 'Sleep / nighttime', a: '🌊 NEPTUNE', c: '#4060ff' },
                { q: 'Maximum intensity', a: '🌙 MOON ROCK', c: '#b464ff' },
              ].map(({ q, a, c }) => (
                <div key={q} className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
                  <span className="text-[0.5rem] tracking-[0.06em] text-white/40">{q}</span>
                  <span className="text-[0.5rem] tracking-[0.08em] font-bold" style={{ color: c }}>{a}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Planet cards */}
          <div className="flex flex-col gap-3">
            {PLANETS.map(p => (
              <button key={p.key} onClick={() => setSelected(p.key)}
                className="w-full flex items-center gap-4 p-4 border border-white/[0.07] bg-white/[0.01] text-left transition-all active:opacity-70"
                style={{ borderColor: `${p.color}20` }}>
                <span className="text-3xl flex-shrink-0">{p.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-display font-extrabold text-base tracking-[0.1em]" style={{ color: p.color }}>{p.name}</span>
                    <span className="text-[0.38rem] tracking-[0.1em] uppercase text-white/30">{p.type}</span>
                    <span className="text-[0.38rem] tracking-[0.1em] px-1.5 py-0.5 border ml-auto"
                      style={{ borderColor: `${p.color}30`, color: p.color }}>{p.thc} THC</span>
                  </div>
                  <span className="text-[0.44rem] tracking-[0.06em] text-white/40">{p.effect}</span>
                </div>
                <span className="text-white/20 text-sm">›</span>
              </button>
            ))}

            {/* Moon Rock */}
            <button onClick={() => setSelected('moonrock')}
              className="w-full flex items-center gap-4 p-4 border border-white/[0.07] bg-white/[0.01] text-left active:opacity-70"
              style={{ borderColor: `${MOON_ROCK.color}20` }}>
              <span className="text-3xl flex-shrink-0">{MOON_ROCK.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-display font-extrabold text-base tracking-[0.1em]" style={{ color: MOON_ROCK.color }}>{MOON_ROCK.name}</span>
                  <span className="text-[0.38rem] tracking-[0.1em] px-1.5 py-0.5 border ml-auto"
                    style={{ borderColor: `${MOON_ROCK.color}30`, color: MOON_ROCK.color }}>{MOON_ROCK.thc} THC</span>
                </div>
                <span className="text-[0.44rem] tracking-[0.06em] text-white/40">Flower + Live Resin + Kief</span>
              </div>
              <span className="text-white/20 text-sm">›</span>
            </button>
          </div>

          {/* Mission Briefing reminder */}
          <div className="mt-5 border border-white/[0.06] bg-white/[0.01] p-4 text-center">
            <p className="text-[0.44rem] tracking-[0.15em] uppercase text-white/30 mb-2">// MISSION BRIEFING™</p>
            <p className="text-[0.5rem] text-white/50 leading-relaxed">
              Remind every customer to scan the QR code on their package.<br/>
              They get a personalized boarding pass and early Paradise access.
            </p>
          </div>
        </div>
      ) : (
        // PLANET DETAIL VIEW
        <div className="px-5 py-6 max-w-lg mx-auto">
          {(() => {
            const p = selected === 'moonrock'
              ? { ...MOON_ROCK, type: 'Concentrate', terpenes: 'Full spectrum', formats: MOON_ROCK.formats, effect: 'Maximum Intensity · 40-60%+ THC' }
              : PLANETS.find(pl => pl.key === selected)!
            return (
              <div className="flex flex-col gap-4">
                <div className="text-center py-4">
                  <div className="text-6xl mb-3">{p.emoji}</div>
                  <h2 className="font-display font-extrabold text-3xl tracking-[0.1em]" style={{ color: p.color }}>{p.name}</h2>
                  <p className="text-[0.5rem] tracking-[0.15em] uppercase text-white/40 mt-1">{p.effect}</p>
                </div>

                {/* Key stats */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'THC', value: p.thc },
                    { label: 'Type', value: p.type },
                    { label: 'Terpenes', value: p.terpenes },
                  ].map(({ label, value }) => (
                    <div key={label} className="border border-white/[0.07] bg-white/[0.01] p-3 text-center">
                      <span className="text-[0.38rem] tracking-[0.15em] uppercase text-white/30 block mb-1">{label}</span>
                      <span className="text-[0.55rem] font-bold" style={{ color: p.color }}>{value}</span>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <div className="border border-white/[0.07] bg-white/[0.01] p-4">
                  <p className="text-[0.42rem] tracking-[0.18em] uppercase text-white/30 mb-2">// PRODUCT</p>
                  <p className="text-[0.55rem] text-white/60 leading-relaxed">{p.desc}</p>
                </div>

                {/* Recommend to */}
                <div className="border p-4" style={{ borderColor: `${p.color}30`, background: `${p.color}06` }}>
                  <p className="text-[0.42rem] tracking-[0.18em] uppercase mb-2" style={{ color: p.color }}>// RECOMMEND TO</p>
                  <p className="text-[0.55rem] leading-relaxed" style={{ color: `${p.color}cc` }}>{p.recommend}</p>
                </div>

                {/* Formats */}
                <div className="border border-white/[0.07] bg-white/[0.01] p-4">
                  <p className="text-[0.42rem] tracking-[0.18em] uppercase text-white/30 mb-3">// AVAILABLE FORMATS</p>
                  <div className="flex flex-wrap gap-2">
                    {p.formats.map(f => (
                      <span key={f} className="text-[0.44rem] tracking-[0.08em] uppercase px-2.5 py-1 border border-white/10 text-white/40">{f}</span>
                    ))}
                  </div>
                </div>

                {/* Budtender pitch line */}
                <div className="border border-white/[0.06] bg-white/[0.01] p-4">
                  <p className="text-[0.42rem] tracking-[0.18em] uppercase text-white/30 mb-2">// YOUR PITCH LINE</p>
                  <p className="text-[0.6rem] text-white/70 leading-relaxed italic">
                    {selected === 'mars' && '"This is our heaviest planet. High THC, myrcene-dominant, full body effect. For when you want maximum intensity."'}
                    {selected === 'jupiter' && '"This is our flagship — balanced hybrid, uplifting and social. Best entry point for any experience level."'}
                    {selected === 'saturn' && '"This one is for the connoisseur. Smooth burn, full terpene profile, linalool-dominant. Repeat buyers love Saturn."'}
                    {selected === 'venus' && '"Warm, euphoric, creative. Pinene-dominant sativa that keeps your head clear. Perfect for daytime."'}
                    {selected === 'neptune' && '"Our premium nighttime indica. Deep body calm, myrcene and linalool dominant. Built for the end of the mission."'}
                    {selected === 'moonrock' && '"Flower soaked in live resin, rolled in kief. 40 to 60 percent THC. This is for experienced consumers who want the absolute maximum."'}
                  </p>
                </div>

              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
