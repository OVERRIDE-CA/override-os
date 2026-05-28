import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)

const PLANET_NAMES: Record<string, string> = {
  mars: 'MARS', jupiter: 'JUPITER', saturn: 'SATURN',
  venus: 'VENUS', neptune: 'NEPTUNE', moonrock: 'REST STATION',
}
const PLANET_COLORS: Record<string, string> = {
  mars: '#ff4820', jupiter: '#f0b428', saturn: '#c4a84a',
  venus: '#ff64b4', neptune: '#4060ff', moonrock: '#b464ff',
}
const PLANET_EMOJIS: Record<string, string> = {
  mars: '🔴', jupiter: '🟡', saturn: '🪐',
  venus: '✨', neptune: '🌊', moonrock: '🌙',
}

// Cron secret to prevent unauthorized calls
function validateCronSecret(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  return secret === process.env.CRON_SECRET
}

export async function POST(req: NextRequest) {
  if (!validateCronSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  // Find users who haven't scanned in 30+ days
  const { data: dormantUsers } = await supabase
    .from('users')
    .select('id, name, email, planet, home_planet, level, scan_count')
    .not('email', 'is', null)
    .or(`last_scan_date.is.null,last_scan_date.lte.${thirtyDaysAgo.toISOString().split('T')[0]}`)
    .limit(100)

  if (!dormantUsers?.length) {
    return NextResponse.json({ success: true, sent: 0, message: 'No dormant users' })
  }

  let sent = 0
  for (const user of dormantUsers) {
    const planet = user.home_planet || user.planet || 'mars'
    const color = PLANET_COLORS[planet] || '#00d4ff'
    const planetName = PLANET_NAMES[planet] || 'MARS'
    const emoji = PLANET_EMOJIS[planet] || '🔴'

    const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#060608;font-family:'Courier New',monospace;color:#fff;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#060608;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <tr><td style="padding:0 0 28px;border-bottom:1px solid rgba(255,255,255,0.08);">
    <p style="margin:0;font-size:18px;font-weight:bold;letter-spacing:0.2em;color:#fff;">OVERRIDE™</p>
    <p style="margin:3px 0 0;font-size:9px;letter-spacing:0.2em;color:rgba(255,255,255,0.3);text-transform:uppercase;">SPACESHIP STRAINS™</p>
  </td></tr>

  <tr><td style="padding:32px 0 24px;text-align:center;">
    <p style="margin:0;font-size:9px;letter-spacing:0.25em;color:rgba(255,255,255,0.3);text-transform:uppercase;">// MISSION ALERT</p>
    <h2 style="margin:12px 0;font-size:28px;font-weight:900;letter-spacing:0.06em;color:#fff;">YOUR NEXT PLANET<br/>IS WAITING.</h2>
    <p style="margin:0;font-size:48px;">${emoji}</p>
    <p style="margin:8px 0 0;font-size:20px;font-weight:bold;letter-spacing:0.1em;color:${color};">${planetName}</p>
  </td></tr>

  <tr><td style="padding:0 0 24px;">
    <div style="border:1px solid ${color}30;background:rgba(0,0,0,0.3);padding:20px 24px;text-align:center;">
      <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.7;">
        Hey ${user.name?.split(' ')[0] || 'Crew'} — it's been a while since your last mission.<br/>
        Your next planet is ready. OVERRIDE is available at dispensaries across Los Angeles.<br/>
        Scan your next package to continue your journey.
      </p>
    </div>
  </td></tr>

  <tr><td style="padding:0 0 28px;text-align:center;">
    <a href="https://www.overridecannabis.com/mission?planet=${planet}"
      style="display:inline-block;background:linear-gradient(135deg,#002878,#1e0064);color:#fff;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;padding:14px 32px;border:1px solid ${color}40;">
      RESUME YOUR MISSION →
    </a>
  </td></tr>

  <tr><td style="padding:20px 0 0;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
    <p style="margin:0;font-size:9px;letter-spacing:0.12em;color:rgba(255,255,255,0.15);text-transform:uppercase;">
      OVERRIDE™ · MISSION BRIEFING™ · LOS ANGELES · 2026
    </p>
    <p style="margin:6px 0 0;font-size:9px;color:rgba(255,255,255,0.1);">
      21+ Only · California · <a href="https://www.overridecannabis.com/unsubscribe?id=${user.id}" style="color:rgba(255,255,255,0.15);">Unsubscribe</a>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`

    try {
      await resend.emails.send({
        from: 'OVERRIDE™ <missions@overridecannabis.com>',
        to: user.email,
        subject: `${emoji} Your next planet is waiting, ${user.name?.split(' ')[0] || 'Crew'}.`,
        html,
      })
      sent++
    } catch {}
  }

  return NextResponse.json({ success: true, sent, total: dormantUsers.length })
}
