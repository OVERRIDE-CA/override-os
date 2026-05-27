import BoardingPassClient from '@/components/BoardingPass'

interface BoardingPassPageProps {
  searchParams: {
    id?: string
    planet?: string
    name?: string
    intensity?: string
    offline?: string
  }
}

export default function BoardingPassPage({ searchParams }: BoardingPassPageProps) {
  const { id, planet, name, intensity, offline } = searchParams

  // Offline fallback data
  const offlineData = offline === 'true' ? {
    name: decodeURIComponent(name || 'CREW'),
    planet: planet || 'jupiter',
    intensity: intensity || 'perfect',
    level: 'NEW_RECRUIT',
  } : undefined

  return <BoardingPassClient userId={id} offlineData={offlineData} />
}
