import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const PLANET_NAMES: Record<string, string> = {
  mars:     'MARS',
  jupiter:  'JUPITER',
  saturn:   'SATURN',
  venus:    'VENUS',
  neptune:  'NEPTUNE',
  moonrock: 'REST STATION',
}

const PLANET_EMOJIS: Record<string, string> = {
  mars: '🔴', jupiter: '🟡', saturn: '🪐',
  venus: '✨', neptune: '🌊', moonrock: '🌙',
}

const PLANET_COLORS: Record<string, string> = {
  mars:     '#ff4820',
  jupiter:  '#f0b428',
  saturn:   '#c4a84a',
  venus:    '#ff64b4',
  neptune:  '#4060ff',
  moonrock: '#b464ff',
}

const LEVEL_DISPLAY: Record<string, string> = {
  NEW_RECRUIT:   'NEW RECRUIT — ECONOMY',
  CREW_MEMBER:   'CREW MEMBER — BUSINESS',
  INNER_CIRCLE:  'INNER CIRCLE — FIRST CLASS',
  FIRST_CONTACT: 'FIRST CONTACT — PRIVATE CHARTER',
}

const NEXT_PLANET: Record<string, Record<string, string>> = {
  mars:     { less: 'SATURN', perfect: 'JUPITER', more: 'MOON ROCK' },
  jupiter:  { less: 'VENUS',  perfect: 'MARS',    more: 'MOON ROCK' },
  saturn:   { less: 'NEPTUNE',perfect: 'NEPTUNE', more: 'JUPITER' },
  venus:    { less: 'JUPITER',perfect: 'MARS',    more: 'MOON ROCK' },
  neptune:  { less: 'SATURN', perfect: 'SATURN',  more: 'VENUS' },
  moonrock: { less: 'MARS',   perfect: 'MARS',    more: 'MOON ROCK' },
}

export async function POST(req: NextRequest) {
  try {
    const { userId, name, email, planet, intensity, level, flightCode } = await req.json()

    if (!email || !name || !planet) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const planetName = PLANET_NAMES[planet] || 'MARS'
    const planetEmoji = PLANET_EMOJIS[planet] || '🔴'
    const planetColor = PLANET_COLORS[planet] || '#ff4820'
    const levelDisplay = LEVEL_DISPLAY[level] || 'NEW RECRUIT — ECONOMY'
    const nextPlanet = NEXT_PLANET[planet]?.[intensity] || 'JUPITER'
    const boardingPassUrl = `https://www.overridecannabis.com/boarding-pass?id=${userId}&cp=${planet}&ci=${intensity}`
    const baseUrl = 'https://www.overridecannabis.com'

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>OVERRIDE™ — Mission Briefing Confirmed</title>
</head>
<body style="margin:0;padding:0;background:#060608;font-family:'Courier New',monospace;color:#ffffff;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#060608;padding:40px 20px;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- HEADER -->
        <tr>
          <td style="padding:0 0 32px 0;border-bottom:1px solid rgba(255,255,255,0.08);">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0;font-size:20px;font-weight:bold;letter-spacing:0.2em;color:#ffffff;">
                    OVERRIDE™
                  </p>
                  <p style="margin:4px 0 0;font-size:10px;letter-spacing:0.2em;color:rgba(255,255,255,0.3);text-transform:uppercase;">
                    SPACESHIP STRAINS™
                  </p>
                </td>
                <td align="right">
                  <span style="font-size:10px;letter-spacing:0.2em;color:rgba(80,255,128,0.8);text-transform:uppercase;border:1px solid rgba(80,255,128,0.2);padding:4px 10px;">
                    ● AUTHORIZED
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- SYSTEM LABEL -->
        <tr>
          <td style="padding:32px 0 8px;text-align:center;">
            <p style="margin:0;font-size:10px;letter-spacing:0.3em;color:rgba(255,255,255,0.25);text-transform:uppercase;">
              OVERRIDE™ SYSTEM ACCESS PORTAL
            </p>
          </td>
        </tr>

        <!-- TITLE -->
        <tr>
          <td style="padding:0 0 32px;text-align:center;">
            <h1 style="margin:0;font-size:36px;font-weight:900;letter-spacing:0.08em;color:#ffffff;line-height:1.1;">
              MISSION<br/>BRIEFING™
            </h1>
            <p style="margin:12px 0 0;font-size:12px;letter-spacing:0.15em;color:rgba(80,255,128,0.8);text-transform:uppercase;">
              ✓ LAUNCH AUTHORIZED
            </p>
          </td>
        </tr>

        <!-- BOARDING PASS CARD -->
        <tr>
          <td style="padding:0 0 24px;">
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:linear-gradient(160deg,#08080f,#0c0819);border:1px solid ${planetColor}30;border-radius:12px;overflow:hidden;">

              <!-- TOP — Airline + Route -->
              <tr>
                <td style="padding:24px 28px 20px;border-bottom:1px solid rgba(255,255,255,0.06);">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <p style="margin:0;font-size:16px;font-weight:bold;letter-spacing:0.18em;color:#ffffff;">OVERRIDE™</p>
                        <p style="margin:3px 0 0;font-size:9px;letter-spacing:0.2em;color:rgba(255,255,255,0.25);text-transform:uppercase;">SPACESHIP STRAINS™</p>
                      </td>
                      <td align="right">
                        <span style="font-size:9px;letter-spacing:0.25em;color:${planetColor};border:1px solid ${planetColor}40;padding:4px 10px;text-transform:uppercase;">
                          BOARDING PASS
                        </span>
                      </td>
                    </tr>
                  </table>

                  <!-- Route -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
                    <tr>
                      <td align="center" width="30%">
                        <p style="margin:0;font-size:28px;font-weight:900;letter-spacing:0.06em;color:#ffffff;">LAX</p>
                        <p style="margin:4px 0 0;font-size:9px;letter-spacing:0.15em;color:rgba(255,255,255,0.3);text-transform:uppercase;">Los Angeles</p>
                      </td>
                      <td align="center" width="40%">
                        <p style="margin:0;font-size:20px;">✈</p>
                        <p style="margin:4px 0 0;font-size:9px;letter-spacing:0.1em;color:rgba(255,255,255,0.2);">- - - - - - -</p>
                      </td>
                      <td align="center" width="30%">
                        <p style="margin:0;font-size:22px;font-weight:900;letter-spacing:0.06em;color:${planetColor};">
                          ${planetEmoji} ${planetName}
                        </p>
                        <p style="margin:4px 0 0;font-size:9px;letter-spacing:0.15em;color:rgba(255,255,255,0.3);text-transform:uppercase;">DESTINATION</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- DETAILS -->
              <tr>
                <td style="padding:20px 28px;border-bottom:1px solid rgba(255,255,255,0.05);">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="33%" style="padding-right:10px;">
                        <p style="margin:0;font-size:8px;letter-spacing:0.2em;color:rgba(255,255,255,0.25);text-transform:uppercase;">Passenger</p>
                        <p style="margin:4px 0 0;font-size:13px;font-weight:bold;color:#ffffff;letter-spacing:0.04em;">${name.toUpperCase()}</p>
                      </td>
                      <td width="33%" style="padding-right:10px;">
                        <p style="margin:0;font-size:8px;letter-spacing:0.2em;color:rgba(255,255,255,0.25);text-transform:uppercase;">Flight</p>
                        <p style="margin:4px 0 0;font-size:13px;font-weight:bold;color:#ffffff;letter-spacing:0.04em;">${flightCode || 'SS-MAR-0001'}</p>
                      </td>
                      <td width="33%">
                        <p style="margin:0;font-size:8px;letter-spacing:0.2em;color:rgba(255,255,255,0.25);text-transform:uppercase;">Date</p>
                        <p style="margin:4px 0 0;font-size:13px;font-weight:bold;color:#ffffff;letter-spacing:0.04em;">
                          ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding-top:14px;padding-right:10px;">
                        <p style="margin:0;font-size:8px;letter-spacing:0.2em;color:rgba(255,255,255,0.25);text-transform:uppercase;">Class</p>
                        <p style="margin:4px 0 0;font-size:11px;font-weight:bold;color:${planetColor};letter-spacing:0.04em;">${levelDisplay}</p>
                      </td>
                      <td style="padding-top:14px;">
                        <p style="margin:0;font-size:8px;letter-spacing:0.2em;color:rgba(255,255,255,0.25);text-transform:uppercase;">Next Planet</p>
                        <p style="margin:4px 0 0;font-size:11px;font-weight:bold;color:${planetColor};letter-spacing:0.04em;">${nextPlanet}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- CTA -->
              <tr>
                <td style="padding:24px 28px;text-align:center;">
                  <a href="${boardingPassUrl}"
                    style="display:inline-block;background:linear-gradient(135deg,#002878,#1e0064);color:#ffffff;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;padding:14px 32px;border:1px solid ${planetColor}40;">
                    VIEW YOUR BOARDING PASS →
                  </a>
                </td>
              </tr>

            </table>
          </td>
        </tr>

        <!-- NEXT DESTINATION -->
        <tr>
          <td style="padding:0 0 24px;">
            <table width="100%" cellpadding="0" cellspacing="0"
              style="border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.01);padding:20px 24px;">
              <tr>
                <td>
                  <p style="margin:0 0 8px;font-size:9px;letter-spacing:0.2em;color:rgba(255,255,255,0.25);text-transform:uppercase;">// NEXT DESTINATION UNLOCKED</p>
                  <p style="margin:0;font-size:16px;font-weight:bold;letter-spacing:0.1em;color:${planetColor};">${nextPlanet}</p>
                  <p style="margin:6px 0 0;font-size:11px;color:rgba(255,255,255,0.45);line-height:1.6;">
                    Ask for OVERRIDE ${nextPlanet} at your dispensary. Available across Los Angeles.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- LINKS -->
        <tr>
          <td style="padding:0 0 32px;text-align:center;">
            <a href="${baseUrl}" style="color:rgba(255,255,255,0.4);font-size:10px;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;margin:0 16px;">
              EXPLORE ALL PLANETS
            </a>
            <a href="https://instagram.com/spaceshipstrains" style="color:rgba(255,255,255,0.4);font-size:10px;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;margin:0 16px;">
              @SPACESHIPSTRAINS
            </a>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="padding:24px 0 0;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
            <p style="margin:0;font-size:9px;letter-spacing:0.15em;color:rgba(255,255,255,0.15);text-transform:uppercase;">
              OVERRIDE™ · MISSION BRIEFING™ · SPACESHIP STRAINS™ · LOS ANGELES · 2026
            </p>
            <p style="margin:8px 0 0;font-size:9px;color:rgba(255,255,255,0.1);">
              21+ Only · California · You received this because you scanned an OVERRIDE product.
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`

    const { data, error } = await resend.emails.send({
      from: 'OVERRIDE™ <missions@overridecannabis.com>',
      to: email,
      subject: `OVERRIDE™ — Your ${planetName} Boarding Pass is Ready 🚀`,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error }, { status: 400 })
    }

    return NextResponse.json({ success: true, id: data?.id })

  } catch (err) {
    console.error('Send confirmation error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
