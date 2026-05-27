import MissionFlow from '@/components/MissionFlow'

interface MissionPageProps {
  searchParams: { planet?: string }
}

export default function MissionPage({ searchParams }: MissionPageProps) {
  const scanPlanet = searchParams.planet?.toLowerCase()
  const validPlanets = ['mars', 'jupiter', 'saturn', 'venus', 'neptune', 'moonrock']
  const planet = validPlanets.includes(scanPlanet || '') ? scanPlanet : undefined

  return <MissionFlow scanPlanet={planet} />
}
