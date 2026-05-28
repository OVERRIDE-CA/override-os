'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError(false)
    const res = await fetch('/api/admin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pwd }),
    })
    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      setError(true)
      setPwd('')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#060608] flex items-center justify-center px-6">
      <div className="w-full max-w-[360px] flex flex-col gap-5">
        <div className="text-center">
          <h1 className="font-display font-extrabold text-3xl tracking-[0.1em] text-white">
            OVERRIDE OS™
          </h1>
          <p className="text-[0.48rem] tracking-[0.2em] uppercase text-white/30 mt-2">
            // Admin Access Required
          </p>
        </div>
        <div>
          <span className="text-[0.42rem] tracking-[0.2em] uppercase text-white/25 mb-1.5 block">
            // Access Code
          </span>
          <input
            type="password"
            value={pwd}
            onChange={e => { setPwd(e.target.value); setError(false) }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="ENTER CODE"
            className="w-full bg-black/40 text-white font-mono text-sm py-4 px-4 outline-none placeholder:text-white/20 border border-white/10"
            style={{ borderBottom: `2px solid ${error ? 'rgba(255,80,80,0.7)' : 'rgba(0,212,255,0.4)'}` }}
            autoFocus
          />
        </div>
        <button
          onClick={handleLogin}
          disabled={loading || !pwd}
          className="w-full py-4 text-[0.65rem] tracking-[0.18em] uppercase font-mono text-white disabled:opacity-50"
          style={{
            background: 'linear-gradient(135deg,rgba(0,40,120,0.9),rgba(50,0,100,0.9))',
            border: '1px solid rgba(0,212,255,0.4)'
          }}>
          {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE →'}
        </button>
        {error && (
          <p className="text-[0.48rem] tracking-[0.15em] uppercase text-red-400/70 text-center">
            ACCESS DENIED
          </p>
        )}
      </div>
    </div>
  )
}
