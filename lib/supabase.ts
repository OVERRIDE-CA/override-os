import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Planet flight codes
export const PLANET_CODES: Record<string, string> = {
  mars:     'SS-MAR',
  jupiter:  'SS-JUP',
  saturn:   'SS-SAT',
  venus:    'SS-VEN',
  neptune:  'SS-NEP',
  moonrock: 'SS-MR',
}

// Planet display names
export const PLANET_NAMES: Record<string, string> = {
  mars:     'MARS',
  jupiter:  'JUPITER',
  saturn:   'SATURN',
  venus:    'VENUS',
  neptune:  'NEPTUNE',
  moonrock: 'MOON ROCK',
}

// Planet accent colors
export const PLANET_COLORS: Record<string, { accent: string; glow: string; text: string }> = {
  mars:     { accent: '#ff4820', glow: 'rgba(255,72,32,0.2)',   text: 'text-mars' },
  jupiter:  { accent: '#f0b428', glow: 'rgba(240,180,40,0.15)', text: 'text-jupiter' },
  saturn:   { accent: '#c4a84a', glow: 'rgba(196,168,74,0.15)', text: 'text-saturn' },
  venus:    { accent: '#ff64b4', glow: 'rgba(255,100,180,0.15)',text: 'text-venus' },
  neptune:  { accent: '#4060ff', glow: 'rgba(64,96,255,0.2)',   text: 'text-neptune' },
  moonrock: { accent: '#b464ff', glow: 'rgba(180,100,255,0.2)', text: 'text-moonrock' },
}

// Planet destination subtitles
export const PLANET_SUBTITLES: Record<string, string> = {
  mars:     'RED ZONE ACTIVE',
  jupiter:  'STORM ROUTE SELECTED',
  saturn:   'RING SECTOR CLEARANCE',
  venus:    'ATMOSPHERIC PROTOCOL',
  neptune:  'DEEP SPACE MODE',
  moonrock: 'MAXIMUM ORBIT SELECTED',
}

// 18-combination routing table
export const ROUTING: Record<string, Record<string, { emoji: string; name: string; key: string; desc: string }>> = {
  mars: {
    less:    { emoji: '🪐', name: 'SATURN',    key: 'saturn',   desc: 'Smoother atmosphere. Linalool-dominant, terpene-forward. The connoisseur orbit after a heavy Mars experience.' },
    perfect: { emoji: '🟡', name: 'JUPITER',   key: 'jupiter',  desc: 'Mars was perfect. Jupiter is your next — balanced hybrid, uplifting, social. The flagship planet.' },
    more:    { emoji: '🌙', name: 'MOON ROCK', key: 'moonrock', desc: 'You want more than Mars. Moon Rock — flower + live resin + kief. 40-60%+ THC. Maximum orbit.' },
  },
  jupiter: {
    less:    { emoji: '✨', name: 'VENUS',     key: 'venus',    desc: 'Lighter energy. Venus is pinene-dominant, warm, euphoric, creative. Keeps your head clear.' },
    perfect: { emoji: '🔴', name: 'MARS',      key: 'mars',     desc: 'Jupiter was perfect. Mars is your next orbit — heavy, intense, myrcene-dominant. Maximum power.' },
    more:    { emoji: '🌙', name: 'MOON ROCK', key: 'moonrock', desc: 'More than Jupiter. Moon Rock — flower + live resin + kief. The top of the lineup.' },
  },
  saturn: {
    less:    { emoji: '🌊', name: 'NEPTUNE',   key: 'neptune',  desc: 'Deeper calm. Neptune — myrcene and linalool dominant. Premium nighttime descent.' },
    perfect: { emoji: '🌊', name: 'NEPTUNE',   key: 'neptune',  desc: 'Saturn was perfect. Neptune takes you deeper — full nighttime descent, introspective.' },
    more:    { emoji: '🟡', name: 'JUPITER',   key: 'jupiter',  desc: 'More energy. Jupiter — balanced hybrid, uplifting and social. A different kind of elevated.' },
  },
  venus: {
    less:    { emoji: '🟡', name: 'JUPITER',   key: 'jupiter',  desc: 'Balance the energy. Jupiter — uplifting, social, best entry point. The natural next step.' },
    perfect: { emoji: '🔴', name: 'MARS',      key: 'mars',     desc: 'Venus was perfect. Mars is next — heavy, intense, high THC. Take the creative energy further.' },
    more:    { emoji: '🌙', name: 'MOON ROCK', key: 'moonrock', desc: 'More than Venus. Moon Rock — flower + live resin + kief. Maximum intensity.' },
  },
  neptune: {
    less:    { emoji: '🪐', name: 'SATURN',    key: 'saturn',   desc: 'Lighter but smooth. Saturn — terpene-forward, relaxing. Relaxation without full depth.' },
    perfect: { emoji: '🪐', name: 'SATURN',    key: 'saturn',   desc: 'Neptune was perfect. Saturn — same calm energy, full terpene profile. Daytime version.' },
    more:    { emoji: '✨', name: 'VENUS',     key: 'venus',    desc: 'More than Neptune. Venus — warm, euphoric, creative. A different kind of elevated experience.' },
  },
  moonrock: {
    less:    { emoji: '🔴', name: 'MARS',      key: 'mars',     desc: 'Moon Rock was intense. Mars — 32% THC without the concentrate layer. Still heavy, still OVERRIDE.' },
    perfect: { emoji: '🔴', name: 'MARS',      key: 'mars',     desc: 'Moon Rock was perfect. Mars is closest — high THC, heavy, myrcene-dominant.' },
    more:    { emoji: '🌙', name: 'MOON ROCK', key: 'moonrock', desc: 'You are at the top of the orbit. Stay on Moon Rock and explore a new planet next time.' },
  },
}

// Level progression
export const LEVELS = ['NEW_RECRUIT', 'CREW_MEMBER', 'INNER_CIRCLE', 'FIRST_CONTACT']
export const LEVEL_DISPLAY: Record<string, string> = {
  NEW_RECRUIT:   'NEW RECRUIT — ECONOMY',
  CREW_MEMBER:   'CREW MEMBER — BUSINESS',
  INNER_CIRCLE:  'INNER CIRCLE — FIRST CLASS',
  FIRST_CONTACT: 'FIRST CONTACT — PRIVATE CHARTER',
}

// DB helpers
export async function createUser(data: {
  name: string
  planet: string
  intensity?: string
  recommendation?: string
  email?: string
  phone?: string
}) {
  const { data: user, error } = await supabase
    .from('users')
    .insert({
      name: data.name,
      planet: data.planet,
      intensity: data.intensity || null,
      recommendation: data.recommendation || null,
      email: data.email || null,
      phone: data.phone || null,
      level: 'NEW_RECRUIT',
      status: 'LAUNCHED',
      scan_count: 1,
    })
    .select()
    .single()

  if (error) throw error
  return user
}

export async function getUserById(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function logEvent(userId: string, eventType: string, metadata: Record<string, unknown> = {}) {
  const { error } = await supabase
    .from('events')
    .insert({ user_id: userId, event_type: eventType, metadata })
  if (error) console.error('Event log error:', error)
}

export async function updateUserLevel(userId: string, level: string) {
  const { error } = await supabase
    .from('users')
    .update({ level })
    .eq('id', userId)
  if (error) throw error
}

export async function incrementScanCount(userId: string) {
  const { data: user } = await supabase
    .from('users')
    .select('scan_count')
    .eq('id', userId)
    .single()

  if (user) {
    const newCount = (user.scan_count || 1) + 1
    let newLevel = 'NEW_RECRUIT'
    if (newCount >= 4) newLevel = 'FIRST_CONTACT'
    else if (newCount >= 3) newLevel = 'INNER_CIRCLE'
    else if (newCount >= 2) newLevel = 'CREW_MEMBER'

    await supabase
      .from('users')
      .update({ scan_count: newCount, level: newLevel })
      .eq('id', userId)

    return { scan_count: newCount, level: newLevel }
  }
  return null
}
