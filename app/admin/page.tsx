'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, PLANET_NAMES, PLANET_COLORS, LEVEL_DISPLAY } from '@/lib/supabase'

const ADMIN_PASSWORD = 'OVERRIDE2026'

const PLANET_EMOJIS: Record<string, string> = {
  mars: '🔴', jupiter: '🟡', saturn: '🪐',
  venus: '✨', neptune: '🌊', moonrock: '🌙',
}

interface User {
  id: string
  name: string
  email: string
  phone: string
  planet: string
  intensity: string
  recommendation: string
  level: string
  scan_count: number
  status: string
  created_at: string
}

interface Stats {
  total: number
  new_recruit: number
  crew_member: number
  inner_circle: number
  first_contact: number
  mars: number
  jupiter: number
  saturn: number
  venus: number
  neptune: number
  moonrock: number
  today: number
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pwd, setPwd] = useState('')
  const [pwdError, setPwdError] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)
  const [blastTarget, setBlastTarget] = useState('all')
  const [blastSubject, setBlastSubject] = useState('')
  const [blastMessage, setBlastMessage] = useState('')
  const [blastSending, setBlastSending] = useState(false)
  const [blastResult, setBlastResult] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'blast'>('overview')
  const [searchQuery, setSearchQuery] = useState('')

  const checkAuth = () => {
    if (pwd === ADMIN_PASSWORD) {
      setAuthed(true)
      localStorage.setItem('override_admin_auth', '1')
    } else {
      setPwdError(true)
      setTimeout(() => setPwdError(false), 2000)
    }
  }

  useEffect(() => {
    if (localStorage.getItem('override_admin_auth') === '1') setAuthed(true)
  }, [])

  useEffect(() => {
    if (authed) { loadStats(); loadUsers() }
  }, [authed])

  const loadStats = async () => {
    const { data } = await supabase.from('users').select('planet, level, created_at')
    if (!data) return
    const today = new Date().toISOString().split('T')[0]
    setStats({
      total: data.length,
      new_recruit: data.filter(u => u.level === 'NEW_RECRUIT').length,
      crew_member: data.filter(u => u.level === 'CREW_MEMBER').length,
      inner_circle: data.filter(u => u.level === 'INNER_CIRCLE').length,
      first_contact: data.filter(u => u.level === 'FIRST_CONTACT').length,
      mars: data.filter(u => u.planet === 'mars').length,
      jupiter: data.filter(u => u.planet === 'jupiter').length,
      saturn: data.filter(u => u.planet === 'saturn').length,
      venus: data.filter(u => u.planet === 'venus').length,
      neptune: data.filter(u => u.planet === 'neptune').length,
      moonrock: data.filter(u => u.planet === 'moonrock').length,
      today: data.filter(u => u.created_at?.startsWith(today)).length,
    })
  }

  const loadUsers = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
    if (data) setUsers(data)
    setLoading(false)
  }

  const sendBlast = async () => {
    if (!blastSubject || !blastMessage) {
      setBlastResult('ERROR: Subject and message required')
      return
    }
    setBlastSending(true)
    setBlastResult('')

    // Get target emails
    let query = supabase.from('users').select('email, name, planet, level, id').not('email', 'is', null)
    if (blastTarget !== 'all') {
      if (['mars','jupiter','saturn','venus','neptune','moonrock'].includes(blastTarget)) {
        query = query.eq('planet', blastTarget)
      } else {
        query = query.eq('level', blastTarget.toUpperCase())
      }
    }
    const { data: targets } = await query
    if (!targets || targets.length === 0) {
      setBlastResult('ERROR: No contacts found for this target')
      setBlastSending(false)
      return
    }

    // Send via API
    const res = await fetch('/api/send-blast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targets,
        subject: blastSubject,
        message: blastMessage,
      }),
    })
    const result = await res.json()
    if (result.success) {
      setBlastResult(`✓ BLAST SENT TO ${targets.length} CONTACTS`)
      setBlastSubject('')
      setBlastMessage('')
    } else {
      setBlastResult(`ERROR: ${result.error || 'Send failed'}`)
    }
    setBlastSending(false)
  }

  const filteredUsers = users.filter(u =>
    !searchQuery ||
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.planet?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const ac = 'rgba(0,212,255,0.8)'

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center px-6">
        <div className="w-full max-w-[360px] flex flex-col gap-5">
          <div className="text-center">
            <h1 className="font-display font-extrabold text-3xl tracking-[0.1em] text-white">OVERRIDE OS™</h1>
            <p className="text-[0.48rem] tracking-[0.2em] uppercase text-white/30 mt-2">// Admin Access Required</p>
          </div>
          <div>
            <span className="text-[0.42rem] tracking-[0.2em] uppercase text-white/25 mb-1.5 block">// Access Code</span>
            <input
              type="password"
              value={pwd}
              onChange={e => setPwd(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && checkAuth()}
              placeholder="ENTER CODE"
              className="w-full bg-black/40 text-white font-mono text-sm py-4 px-4 outline-none placeholder:text-white/20 border border-white/10"
              style={{ borderBottom: `2px solid ${pwdError ? 'rgba(255,80,80,0.7)' : ac}` }}
              autoFocus
            />
          </div>
          <button onClick={checkAuth}
            className="w-full py-4 text-[0.65rem] tracking-[0.18em] uppercase font-mono text-white"
            style={{ background: 'linear-gradient(135deg,rgba(0,40,120,0.9),rgba(50,0,100,0.9))', border: `1px solid ${ac}40` }}>
            AUTHENTICATE →
          </button>
          {pwdError && <p className="text-[0.48rem] tracking-[0.15em] uppercase text-red-400/70 text-center">ACCESS DENIED</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#060608] text-white font-mono">
      {/* Header */}
      <div className="border-b border-white/[0.07] px-6 py-4 flex items-center justify-between">
        <div>
          <span className="font-display font-extrabold text-lg tracking-[0.15em]">OVERRIDE OS™</span>
          <span className="text-[0.42rem] tracking-[0.2em] uppercase text-white/30 ml-3">// COMMAND CENTER</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400/80" style={{ boxShadow: '0 0 6px rgba(80,255,128,0.8)' }} />
          <span className="text-[0.42rem] tracking-[0.2em] uppercase text-green-400/80">SYSTEM ACTIVE</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/[0.07] px-6 flex gap-0">
        {(['overview','users','blast'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="py-3 px-5 text-[0.5rem] tracking-[0.2em] uppercase transition-all"
            style={{
              color: activeTab === tab ? '#00d4ff' : 'rgba(255,255,255,0.3)',
              borderBottom: activeTab === tab ? '2px solid #00d4ff' : '2px solid transparent',
            }}>
            {tab}
          </button>
        ))}
      </div>

      <div className="px-6 py-6 max-w-5xl mx-auto">

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && stats && (
          <div className="flex flex-col gap-6">
            {/* Top stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Total Users', value: stats.total, color: '#00d4ff' },
                { label: 'Today', value: stats.today, color: 'rgba(80,255,128,0.9)' },
                { label: 'Inner Circle', value: stats.inner_circle, color: '#f0b428' },
                { label: 'First Contact', value: stats.first_contact, color: '#b464ff' },
              ].map(({ label, value, color }) => (
                <div key={label} className="border border-white/[0.07] bg-white/[0.02] p-4 text-center">
                  <span className="font-display font-extrabold text-3xl block" style={{ color }}>{value}</span>
                  <span className="text-[0.42rem] tracking-[0.15em] uppercase text-white/30 mt-1 block">{label}</span>
                </div>
              ))}
            </div>

            {/* Level breakdown */}
            <div className="border border-white/[0.07] bg-white/[0.01] p-5">
              <p className="text-[0.44rem] tracking-[0.25em] uppercase text-white/30 mb-4">// Level Distribution</p>
              <div className="flex flex-col gap-3">
                {[
                  { key: 'NEW_RECRUIT',   label: 'New Recruit',   value: stats.new_recruit,   color: 'rgba(0,212,255,0.6)' },
                  { key: 'CREW_MEMBER',   label: 'Crew Member',   value: stats.crew_member,   color: '#f0b428' },
                  { key: 'INNER_CIRCLE',  label: 'Inner Circle',  value: stats.inner_circle,  color: '#ff64b4' },
                  { key: 'FIRST_CONTACT', label: 'First Contact', value: stats.first_contact, color: '#b464ff' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-[0.44rem] tracking-[0.1em] uppercase w-28 flex-shrink-0" style={{ color }}>{label}</span>
                    <div className="flex-1 h-1.5 bg-white/[0.06] rounded-sm overflow-hidden">
                      <div className="h-full rounded-sm transition-all duration-700"
                        style={{ width: stats.total ? `${(value / stats.total) * 100}%` : '0%', background: color }} />
                    </div>
                    <span className="text-[0.48rem] text-white/40 w-6 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Planet breakdown */}
            <div className="border border-white/[0.07] bg-white/[0.01] p-5">
              <p className="text-[0.44rem] tracking-[0.25em] uppercase text-white/30 mb-4">// Planet Distribution</p>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                {(['mars','jupiter','saturn','venus','neptune','moonrock'] as const).map(p => {
                  const count = stats[p as keyof Stats] as number
                  const pc = PLANET_COLORS[p]
                  return (
                    <div key={p} className="border border-white/[0.06] bg-white/[0.01] p-3 text-center">
                      <span className="text-2xl block mb-1">{PLANET_EMOJIS[p]}</span>
                      <span className="font-display font-bold text-lg block" style={{ color: pc.accent }}>{count}</span>
                      <span className="text-[0.38rem] tracking-[0.1em] uppercase text-white/30">{PLANET_NAMES[p]}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <button onClick={() => { loadStats(); loadUsers() }}
              className="self-start px-6 py-3 text-[0.5rem] tracking-[0.18em] uppercase border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all">
              ↻ REFRESH DATA
            </button>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="SEARCH BY NAME, EMAIL, OR PLANET..."
                className="flex-1 bg-black/40 text-white font-mono text-xs py-3 px-4 outline-none placeholder:text-white/20 border border-white/10"
                style={{ borderBottom: '2px solid rgba(0,212,255,0.4)' }}
              />
              <span className="text-[0.44rem] tracking-[0.1em] uppercase text-white/30 flex-shrink-0">
                {filteredUsers.length} users
              </span>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-[0.48rem] tracking-[0.2em] uppercase text-white/30">LOADING...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full" style={{ fontSize: '0.55rem', letterSpacing: '0.06em' }}>
                  <thead>
                    <tr className="border-b border-white/[0.07]">
                      {['Name','Email','Planet','Intensity','Next','Level','Scans','Date'].map(h => (
                        <th key={h} className="text-left py-2 px-3 text-white/25 uppercase tracking-[0.15em] font-normal">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => {
                      const pc = PLANET_COLORS[u.planet] || { accent: '#00d4ff' }
                      return (
                        <tr key={u.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                          <td className="py-2.5 px-3 text-white font-bold">{u.name?.toUpperCase() || '—'}</td>
                          <td className="py-2.5 px-3 text-white/50">{u.email || '—'}</td>
                          <td className="py-2.5 px-3">
                            <span style={{ color: pc.accent }}>{PLANET_EMOJIS[u.planet]} {PLANET_NAMES[u.planet] || u.planet}</span>
                          </td>
                          <td className="py-2.5 px-3 text-white/40 uppercase">{u.intensity || '—'}</td>
                          <td className="py-2.5 px-3 text-white/40 uppercase">{u.recommendation || '—'}</td>
                          <td className="py-2.5 px-3">
                            <span className="text-[0.42rem] tracking-[0.08em] uppercase px-2 py-0.5 border"
                              style={{ borderColor: `${pc.accent}30`, color: pc.accent, background: `${pc.accent}08` }}>
                              {u.level?.replace('_', ' ') || 'NEW RECRUIT'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-white/40">{u.scan_count || 1}</td>
                          <td className="py-2.5 px-3 text-white/30">
                            {u.created_at ? new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-[0.48rem] tracking-[0.2em] uppercase text-white/20">NO CONTACTS YET</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* BLAST TAB */}
        {activeTab === 'blast' && (
          <div className="flex flex-col gap-5 max-w-xl">
            <div className="border border-amber-400/20 bg-amber-400/[0.04] px-4 py-3">
              <p className="text-[0.48rem] tracking-[0.08em] text-amber-300/60 leading-relaxed">
                ⚠️ This sends a real email to all selected contacts. Use carefully.
              </p>
            </div>

            <div>
              <span className="text-[0.42rem] tracking-[0.2em] uppercase text-white/25 mb-1.5 block">// Send To</span>
              <select value={blastTarget} onChange={e => setBlastTarget(e.target.value)}
                className="w-full bg-black/40 text-white font-mono text-xs py-3 px-4 outline-none border border-white/10"
                style={{ borderBottom: '2px solid rgba(0,212,255,0.4)' }}>
                <option value="all">All Contacts</option>
                <option value="mars">🔴 Mars Buyers</option>
                <option value="jupiter">🟡 Jupiter Buyers</option>
                <option value="saturn">🪐 Saturn Buyers</option>
                <option value="venus">✨ Venus Buyers</option>
                <option value="neptune">🌊 Neptune Buyers</option>
                <option value="moonrock">🌙 Moon Rock Buyers</option>
                <option value="inner_circle">Inner Circle Only</option>
                <option value="first_contact">First Contact Only</option>
              </select>
            </div>

            <div>
              <span className="text-[0.42rem] tracking-[0.2em] uppercase text-white/25 mb-1.5 block">// Subject</span>
              <input type="text" value={blastSubject} onChange={e => setBlastSubject(e.target.value)}
                placeholder="OVERRIDE™ — New Drop Available"
                className="w-full bg-black/40 text-white font-mono text-xs py-3 px-4 outline-none placeholder:text-white/20 border border-white/10"
                style={{ borderBottom: '2px solid rgba(0,212,255,0.4)' }}
              />
            </div>

            <div>
              <span className="text-[0.42rem] tracking-[0.2em] uppercase text-white/25 mb-1.5 block">// Message</span>
              <textarea value={blastMessage} onChange={e => setBlastMessage(e.target.value)}
                placeholder="OVERRIDE just landed at [dispensary name]. Ask for it by name. 🚀"
                rows={5}
                className="w-full bg-black/40 text-white font-mono text-xs py-3 px-4 outline-none placeholder:text-white/20 border border-white/10 resize-none"
                style={{ borderBottom: '2px solid rgba(0,212,255,0.4)' }}
              />
            </div>

            <button onClick={sendBlast} disabled={blastSending}
              className="w-full py-4 text-[0.65rem] tracking-[0.18em] uppercase font-mono text-white disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,rgba(0,40,120,0.9),rgba(50,0,100,0.9))', border: '1px solid rgba(0,212,255,0.4)' }}>
              {blastSending ? 'SENDING...' : 'SEND BLAST →'}
            </button>

            {blastResult && (
              <p className="text-[0.5rem] tracking-[0.12em] uppercase text-center"
                style={{ color: blastResult.startsWith('✓') ? 'rgba(80,255,128,0.8)' : 'rgba(255,80,80,0.7)' }}>
                {blastResult}
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
