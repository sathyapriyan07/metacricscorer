import { useEffect, useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import GlassCard from '../components/layout/GlassCard'
import { fetchTournaments } from '../services/api'
import type { Tournament } from '../types'
import { getImageUrl } from '../utils/imageHelper'

const TournamentsPage = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([])

  useEffect(() => {
    fetchTournaments().then(setTournaments).catch(() => setTournaments([]))
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Tournaments" subtitle="ODI WC, T20 WC, and custom tournaments." />
      <div className="grid gap-4 lg:grid-cols-3">
        {tournaments.length === 0 ? (
          <GlassCard>
            <p className="text-sm text-slate-300">No tournaments yet.</p>
          </GlassCard>
        ) : null}
        {tournaments.map((tournament) => (
          <GlassCard key={tournament.id} className="space-y-3">
            <img
              src={getImageUrl({ entity: tournament, bucket: 'tournament-logos' })}
              alt={tournament.name}
              className="h-14 w-14 rounded-xl object-cover"
              loading="lazy"
              width={56}
              height={56}
            />
            <div>
              <p className="font-display text-xl">{tournament.name}</p>
              <div className="mt-2 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-widest text-slate-300">
                {tournament.format}
              </div>
              <p className="mt-3 text-xs text-slate-400">Teams: --</p>
              <p className="text-xs text-slate-400">Status: Upcoming</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}

export default TournamentsPage
