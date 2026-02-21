import { useEffect, useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import GlassCard from '../components/layout/GlassCard'
import { fetchLeagues } from '../services/api'
import type { League } from '../types'
import { getImageUrl } from '../utils/imageHelper'

const LeaguesPage = () => {
  const [leagues, setLeagues] = useState<League[]>([])

  useEffect(() => {
    fetchLeagues().then(setLeagues).catch(() => setLeagues([]))
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Leagues" subtitle="IPL, BBL, SA20, MLC and beyond." />
      <div className="grid gap-4 lg:grid-cols-3">
        {leagues.length === 0 ? (
          <GlassCard>
            <p className="text-sm text-slate-300">No leagues yet.</p>
          </GlassCard>
        ) : null}
        {leagues.map((league) => (
          <GlassCard key={league.id} className="space-y-3">
            <img
              src={getImageUrl({ entity: league, bucket: 'league-logos' })}
              alt={league.name}
              className="h-14 w-14 rounded-xl object-cover"
              loading="lazy"
              width={56}
              height={56}
            />
            <div>
              <p className="font-display text-xl">{league.name}</p>
              <div className="mt-2 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-widest text-slate-300">
                {league.format}
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

export default LeaguesPage
