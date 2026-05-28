import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const PLANET_COLORS: Record<string, string> = {
  mars: '#ff4820', jupiter: '#f0b428', saturn: '#c4a84a',
  venus: '#ff64b4', neptune: '#4060ff', moonrock: '#b464ff',
}

export async function POST(req: NextRequest) {
  try {
    const { targets, subject, message } = await req.json()

    if (!targets?.length || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Send in batches of 50 (Resend batch limit)
    const results = []
    const batches = []
    for (let i = 0; i < targets.length; i += 50) {
      batches.push(targets.slice(i, i + 50))
    }

    for (const batch of batches) {
      const emails = batch
        .filter((t: { email?: string }) => t.email)
        .map((t: { email: string; name: string; planet: string; id: string }) => {
          const color = PLANET_COLORS[t.planet] || '#00d4ff'
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

    <tr><td style="padding:32px 0 24px;">
      <h2 style="margin:0 0 20px;font-size:22px;font-weight:900;letter-spacing:0.06em;color:#fff;">${subject}</h2>
      <div style="border:1px solid ${color}30;background:rgba(0,0,0,0.3);padding:20px 24px;">
        <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.7);line-height:1.7;">${message.replace(/\n/g, '<br/>')}</p>
      </div>
    </td></tr>

    <tr><td style="padding:0 0 28px;text-align:center;">
      <a href="https://www.overridecannabis.com/mission"
        style="display:inline-block;background:linear-gradient(135deg,#002878,#1e0064);color:#fff;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;padding:12px 28px;border:1px solid ${color}40;">
        SCAN YOUR NEXT PLANET →
      </a>
    </td></tr>

    <tr><td style="padding:20px 0 0;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
      <p style="margin:0;font-size:9px;letter-spacing:0.15em;color:rgba(255,255,255,0.15);text-transform:uppercase;">
        OVERRIDE™ · MISSION BRIEFING™ · SPACESHIP STRAINS™ · LOS ANGELES · 2026
      </p>
      <p style="margin:6px 0 0;font-size:9px;color:rgba(255,255,255,0.1);">
        21+ Only · California · You received this because you scanned an OVERRIDE product.
      </p>
    </td></tr>

  </table>
  </td></tr>
</table>
</body>
</html>`

          return {
            from: 'OVERRIDE™ <missions@overridecannabis.com>',
            to: t.email,
            subject,
            html,
          }
        })

      const batchResult = await resend.batch.send(emails)
      results.push(batchResult)
    }

    return NextResponse.json({ success: true, sent: targets.length })
  } catch (err) {
    console.error('Blast error:', err)
    return NextResponse.json({ error: 'Failed to send blast' }, { status: 500 })
  }
}
