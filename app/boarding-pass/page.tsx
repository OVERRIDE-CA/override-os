import { Metadata } from 'next'
import BoardingPassClient from '@/components/BoardingPass'
import { createClient } from '@supabase/supabase-js'

interface Props {
  searchParams: {
    id?: string; planet?: string; name?: string
    intensity?: string; offline?: string; cp?: string; ci?: string
  }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { id, cp, planet = 'mars', name = 'CREW' } = searchParams
  const passPlanet = cp || planet
  let passengerName = decodeURIComponent(name).toUpperCase()
  let metaPlanet = passPlanet

  if (id) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data } = await supabase.from('users').select('name, planet').eq('id', id).single()
      if (data) { passengerName = data.name.toUpperCase(); if (!cp) metaPlanet = data.planet }
    } catch {}
  }

  const PLANET_NAMES: Record<string, string> = {
    mars: 'MARS', jupiter: 'JUPITER', saturn: 'SATURN',
    venus: 'VENUS', neptune: 'NEPTUNE', moonrock: 'REST STATION',
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.overridecannabis.com'
  const planetName = PLANET_NAMES[metaPlanet] || 'MARS'
  const title = `OVERRIDE™ — ${passengerName} · ${planetName} Boarding Pass`
  const description = `${passengerName} just boarded OVERRIDE ${planetName}. Mission Briefing activated. SpaceShip Strains · Los Angeles 2026.`
  const imageParams = id ? `id=${id}&cp=${metaPlanet}` : `planet=${metaPlanet}&name=${encodeURIComponent(passengerName)}`
  const imageUrl = `${baseUrl}/boarding-pass/opengraph-image?${imageParams}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `OVERRIDE™ ${planetName} Boarding Pass` }],
      type: 'website',
      siteName: 'OVERRIDE™ by SpaceShip Strains',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    other: {
      'og:image:width': '1200',
      'og:image:height': '630',
    }
  }
}

export default function BoardingPassPage({ searchParams }: Props) {
  const { id, planet, name, intensity, offline, cp, ci } = searchParams
  const offlineData = offline === 'true' ? {
    name: decodeURIComponent(name || 'CREW'),
    planet: cp || planet || 'jupiter',
    intensity: ci || intensity || 'perfect',
    level: 'NEW_RECRUIT',
  } : undefined

  return (
    <BoardingPassClient
      userId={id}
      offlineData={offlineData}
      currentPlanet={cp}
      currentIntensity={ci}
    />
  )
}