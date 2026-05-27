import { Metadata } from 'next'
import BoardingPassClient from '@/components/BoardingPass'
import { createClient } from '@supabase/supabase-js'

interface BoardingPassPageProps {
  searchParams: {
    id?: string
    planet?: string
    name?: string
    intensity?: string
    offline?: string
    cp?: string  // current session planet
    ci?: string  // current session intensity
  }
}

export async function generateMetadata({ searchParams }: BoardingPassPageProps): Promise<Metadata> {
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
      if (data) {
        passengerName = data.name.toUpperCase()
        // Use current session planet if provided, else Supabase
        if (!cp) metaPlanet = data.planet
      }
    } catch {}
  }

  const PLANET_NAMES: Record<string, string> = {
    mars: 'MARS', jupiter: 'JUPITER', saturn: 'SATURN',
    venus: 'VENUS', neptune: 'NEPTUNE', moonrock: 'MOON ROCK',
  }

  // #3 Dynamic base URL — works on any domain
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://override-os.vercel.app'

  const planetName = PLANET_NAMES[metaPlanet] || 'MARS'
  const title = `OVERRIDE™ Boarding Pass — ${passengerName}`
  const description = `${passengerName} just boarded OVERRIDE ${planetName} by SpaceShip Strains. Mission Briefing activated. Los Angeles 2026.`
  const imageParams = id
    ? `id=${id}&cp=${metaPlanet}`
    : `planet=${metaPlanet}&name=${encodeURIComponent(passengerName)}`
  const imageUrl = `${baseUrl}/boarding-pass/opengraph-image?${imageParams}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `OVERRIDE™ Boarding Pass — ${planetName}` }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default function BoardingPassPage({ searchParams }: BoardingPassPageProps) {
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